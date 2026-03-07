import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { Article, ArticlesApiResponse } from '@/types/article'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'

// GET /api/articles - получить все статьи с пагинацией
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '9', 10)
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  // Пробуем получить из БД
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
  } catch (error) {
    console.log('Database not available, using static data:', error)
  }
  
  // Fallback: статические данные
  let filteredArticles = staticArticles.filter((a: StaticArticle) => a.status === 'PUBLISHED')
  
  if (slug) {
    const article = filteredArticles.find((a: StaticArticle) => a.slug === slug)
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Статья не найдена' },
        { status: 404 }
      )
    }
    
    const response: ArticlesApiResponse = {
      success: true,
      data: [{
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content || article.excerpt,
        coverImage: article.image,
        category: article.category,
        author: article.author,
        status: article.status,
        views: article.views || 0,
        readingTime: Math.ceil((article.content?.length || 200) / 1000),
        createdAt: new Date(article.date),
        updatedAt: new Date(article.date),
        publishedAt: new Date(article.date),
        tags: article.tags
      }]
    }
    return NextResponse.json(response)
  }
  
  if (category) {
    filteredArticles = filteredArticles.filter((a: StaticArticle) => a.category === category)
  }
  
  const offset = (page - 1) * limit
  const total = filteredArticles.length
  const totalPages = Math.ceil(total / limit)
  const paginatedArticles = filteredArticles.slice(offset, offset + limit)
  
  const response: ArticlesApiResponse = {
    success: true,
    data: paginatedArticles.map((a: StaticArticle) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content || a.excerpt,
      coverImage: a.image,
      category: a.category,
      author: a.author,
      status: a.status,
      views: a.views || 0,
      readingTime: Math.ceil((a.content?.length || 200) / 1000),
      createdAt: new Date(a.date),
      updatedAt: new Date(a.date),
      publishedAt: new Date(a.date),
      tags: a.tags
    })),
    featured: page === 1 ? {
      id: filteredArticles[0].id,
      slug: filteredArticles[0].slug,
      title: filteredArticles[0].title,
      excerpt: filteredArticles[0].excerpt,
      content: filteredArticles[0].content || filteredArticles[0].excerpt,
      coverImage: filteredArticles[0].image,
      category: filteredArticles[0].category,
      author: filteredArticles[0].author,
      status: filteredArticles[0].status,
      views: filteredArticles[0].views || 0,
      readingTime: Math.ceil((filteredArticles[0].content?.length || 200) / 1000),
      createdAt: new Date(filteredArticles[0].date),
      updatedAt: new Date(filteredArticles[0].date),
      publishedAt: new Date(filteredArticles[0].date),
      tags: filteredArticles[0].tags
    } : undefined,
    total,
    page,
    totalPages
  }
  
  return NextResponse.json(response)
}

