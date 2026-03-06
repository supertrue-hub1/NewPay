import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Функция проверки существования таблицы
async function checkTableExists(): Promise<boolean> {
  try {
    const checkTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'partners'
      )
    `)
    return checkTable.rows[0].exists
  } catch {
    return false
  }
}

// GET /api/partners/admin - Получить всех партнёров (включая неактивные)
export async function GET() {
  try {
    console.log('DB config:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    })
    
    const tableExists = await checkTableExists()
    console.log('Table exists:', tableExists)
    
    if (!tableExists) {
      return NextResponse.json([])
    }
    const result = await query('SELECT * FROM partners ORDER BY sort_order ASC')
    console.log('Partners result:', result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json({ error: 'Failed to fetch partners', details: String(error), stack: (error as Error).stack }, { status: 500 })
  }
}

// POST /api/partners/admin - Добавить партнёра
export async function POST(request: Request) {
  try {
    const tableExists = await checkTableExists()
    if (!tableExists) {
      return NextResponse.json({ error: 'Таблица partners не существует. Создайте её через панель БД.' }, { status: 500 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      image_url,
      link,
      category,
      is_active = true,
      sort_order = 0
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO partners (name, slug, description, image_url, link, category, is_active, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, slug, description, image_url, link, category, is_active, sort_order]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Failed to create partner', details: String(error) }, { status: 500 })
  }
}

// PUT /api/partners/admin - Обновить партнёра
export async function PUT(request: Request) {
  try {
    const tableExists = await checkTableExists()
    if (!tableExists) {
      return NextResponse.json({ error: 'Таблица partners не существует' }, { status: 500 })
    }

    const body = await request.json()
    const {
      id,
      name,
      slug,
      description,
      image_url,
      link,
      category,
      is_active,
      sort_order
    } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query(
      `UPDATE partners 
       SET name = $1, slug = $2, description = $3, image_url = $4, link = $5, 
           category = $6, is_active = $7, sort_order = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING *`,
      [name, slug, description, image_url, link, category, is_active, sort_order, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ error: 'Failed to update partner', details: String(error) }, { status: 500 })
  }
}

// DELETE /api/partners/admin - Удалить партнёра
export async function DELETE(request: Request) {
  try {
    const tableExists = await checkTableExists()
    if (!tableExists) {
      return NextResponse.json({ error: 'Таблица partners не существует' }, { status: 500 })
    }

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
    return NextResponse.json({ error: 'Failed to delete partner', details: String(error) }, { status: 500 })
  }
}
