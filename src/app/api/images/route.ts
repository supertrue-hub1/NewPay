import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

// Создание таблицы изображений
async function createImagesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(500) NOT NULL,
      path VARCHAR(500) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      alt VARCHAR(500),
      article_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
    )
  `)
}

// GET - список изображений с пагинацией и поиском
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('search') || ''

    // Создаём таблицу если нет
    try {
      await createImagesTable()
    } catch (e) {
      // Таблица уже существует
    }

    const offset = (page - 1) * limit
    
    let whereClause = '1=1'
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (original_name ILIKE $${paramIndex} OR alt ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    // Получаем общее количество
    const countResult = await query(
      `SELECT COUNT(*) as total FROM images WHERE ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0]?.total || '0', 10)

    // Получаем изображения
    const dataResult = await query(
      `SELECT * FROM images WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    )

    const images = dataResult.rows.map((row: any) => {
      // Конвертируем путь /images/articles/ в /api/serve-image/ для отдачи через API
      const apiPath = row.path.replace('/images/articles/', '/api/serve-image/')
      return {
        id: row.id,
        filename: row.filename,
        originalName: row.original_name,
        path: row.path,
        url: apiPath,
        mimeType: row.mime_type,
        size: row.size,
        width: row.width,
        height: row.height,
        alt: row.alt,
        articleId: row.article_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    })

    return NextResponse.json({
      success: true,
      data: images,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error: any) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка получения изображений' },
      { status: 500 }
    )
  }
}
