import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { Article, ArticlesApiResponse } from '@/types/article'

// Транслитерация для slug
const transliterate = (text: string): string => {
  const ruToEn: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', '_': '-', '.': '-', ',': '-', '/': '-', '\\': '-',
    '|': '-', '(': '', ')': '', '[': '', ']': '', '{': '', '}': '',
    '<': '', '>': '', '"': '', "'": '', '`': '', '!': '', '?': '',
    '#': '', '$': '', '%': '', '^': '', '&': '', '*': '', '+': '=',
    '=': '-', '@': '', '~': '', ':': '-', ';': '-'
  }
  return text
    .split('')
    .map(char => ruToEn[char] || char)
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

// GET /api/articles - получить все статьи с пагинацией
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '9', 10)
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  // Только БД - без fallback
  try {
    let whereClause = "WHERE status = 'PUBLISHED'"
    const params: any[] = []
    let paramIndex = 1
    
    if (slug) {
      whereClause += ` AND slug = $${paramIndex}`
      params.push(slug)
      paramIndex++
    } else if (category) {
      whereClause += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }
    
    const offset = (page - 1) * limit
    
    // Получаем общее количество
    const countResult = await query(`SELECT COUNT(*) as total FROM articles ${whereClause}`, params)
    const total = parseInt(countResult.rows[0]?.total || '0', 10)
    
    if (total > 0) {
      // Есть статьи в БД
      const dataQuery = `SELECT * FROM articles ${whereClause} ORDER BY views DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
      const dataResult = await query(dataQuery, [...params, limit, offset])
      
      const articles = dataResult.rows.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content || row.excerpt,
        coverImage: row.cover_image || row.coverImage,
        category: row.category,
        author: row.author,
        status: row.status,
        views: row.views || 0,
        readingTime: row.reading_time || Math.ceil((row.content?.length || 200) / 1000),
        createdAt: row.created_at || row.createdAt,
        updatedAt: row.updated_at || row.updatedAt,
        publishedAt: row.published_at || row.publishedAt,
        tags: row.tags ? row.tags.split(',') : []
      }))

      // Получаем первую статью для featured
      let featured = null
      if (page === 1 && !slug) {
        const featuredResult = await query(`SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY views DESC LIMIT 1`)
        if (featuredResult.rows[0]) {
          const row = featuredResult.rows[0]
          featured = {
            id: row.id,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            content: row.content || row.excerpt,
            coverImage: row.cover_image || row.coverImage,
            category: row.category,
            author: row.author,
            status: row.status,
            views: row.views || 0,
            readingTime: row.reading_time || Math.ceil((row.content?.length || 200) / 1000),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            publishedAt: row.published_at,
            tags: row.tags ? row.tags.split(',') : []
          }
        }
      }

      const response: ArticlesApiResponse = {
        success: true,
        data: articles,
        featured: featured || undefined,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
      
      return NextResponse.json(response)
    }
    
    // Нет статей в БД
    return NextResponse.json({
      success: true,
      data: [],
      featured: undefined,
      total: 0,
      page,
      totalPages: 0
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}

// POST /api/articles - Создать статью
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      author,
      status,
      views,
      reading_time,
      tags
    } = body

    // Генерируем slug если не передан
    const articleSlug = slug || transliterate(title)

    const result = await query(
      `INSERT INTO articles (slug, title, excerpt, content, cover_image, category, author, status, views, reading_time, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [articleSlug, title, excerpt, content, cover_image, category || 'Советы', author || 'Редакция', status || 'PUBLISHED', views || 0, reading_time || 5, tags]
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating article:', error)
    
    // Если таблицы нет - создаём и пробуем снова
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      try {
        await query(`
          CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(500) NOT NULL,
            excerpt TEXT,
            content TEXT,
            cover_image VARCHAR(500),
            category VARCHAR(100) DEFAULT 'Советы',
            author VARCHAR(100) DEFAULT 'Редакция',
            status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
            views INTEGER DEFAULT 0,
            reading_time INTEGER DEFAULT 5,
            tags VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        // Повторяем вставку
        const body = await request.json()
        const { title, slug, excerpt, content, cover_image, category, author, status, views, reading_time, tags } = body
        const articleSlug = slug || transliterate(title)
        
        const result = await query(
          `INSERT INTO articles (slug, title, excerpt, content, cover_image, category, author, status, views, reading_time, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          [articleSlug, title, excerpt, content, cover_image, category || 'Советы', author || 'Редакция', status || 'PUBLISHED', views || 0, reading_time || 5, tags]
        )
        
        return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
      } catch (createError) {
        console.error('Error creating table:', createError)
        return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 })
  }
}

// PUT /api/articles - Обновить статью
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      author,
      status,
      views,
      reading_time,
      tags
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const articleSlug = slug || transliterate(title)

    const result = await query(
      `UPDATE articles 
       SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5, category = $6, 
           author = $7, status = $8, views = $9, reading_time = $10, tags = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 
       RETURNING *`,
      [title, articleSlug, excerpt, content, cover_image, category, author, status, views, reading_time, tags, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 })
  }
}

// DELETE /api/articles - Удалить статью
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const result = await query('DELETE FROM articles WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Article deleted' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 })
  }
}

