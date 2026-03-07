import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/partners - Получить всех партнёров
export async function GET() {
  try {
    // Проверяем существование таблицы
    const checkTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'partners'
      )
    `)
    
    if (!checkTable.rows[0].exists) {
      return NextResponse.json([])
    }
    
    const result = await query('SELECT * FROM partners WHERE is_active = true ORDER BY sort_order ASC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json({ error: 'Failed to fetch partners', details: String(error) }, { status: 500 })
  }
}

// POST /api/partners - Добавить партнёра
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      image_url,
      link,
      category,
      license,
      is_active = true,
      sort_order = 0
    } = body

    // Проверяем существование таблицы
    const checkTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'partners'
      )
    `)

    if (!checkTable.rows[0].exists) {
      return NextResponse.json({ error: 'Таблица partners не существует. Создайте её через панель БД.' }, { status: 500 })
    }

    const result = await query(
      `INSERT INTO partners (name, slug, description, image_url, link, category, license, is_active, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [name, slug, description, image_url, link, category, license, is_active, sort_order]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Failed to create partner', details: String(error) }, { status: 500 })
  }
}

// PUT /api/partners - Обновить партнёра
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      slug,
      description,
      image_url,
      link,
      category,
      license,
      is_active,
      sort_order
    } = body

    const result = await query(
      `UPDATE partners 
       SET name = $1, slug = $2, description = $3, image_url = $4, link = $5, 
           category = $6, license = $7, is_active = $8, sort_order = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 
       RETURNING *`,
      [name, slug, description, image_url, link, category, license, is_active, sort_order, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
  }
}

// DELETE /api/partners - Удалить партнёра
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query('DELETE FROM partners WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Partner deleted successfully' })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
  }
}

