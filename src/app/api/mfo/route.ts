import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { mfoData as staticMfoData } from '@/data/mfo-data'

// GET /api/mfo - Получить все MFO компании
export async function GET() {
  try {
    const result = await query('SELECT * FROM mfo_companies ORDER BY rating DESC')
    if (result.rows && result.rows.length > 0) {
      return NextResponse.json(result.rows)
    }
    // Если данных нет в БД - возвращаем статические
    return NextResponse.json(staticMfoData)
  } catch (error) {
    console.error('Error fetching MFO:', error)
    // При ошибке возвращаем статические данные вместо 500
    return NextResponse.json(staticMfoData)
  }
}

// POST /api/mfo - Добавить новую MFO компанию
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      logo,
      rating = 0,
      reviews = 0,
      sum_min = 0,
      sum_max = 0,
      term_min = 0,
      term_max = 0,
      percent = 0,
      first_free = false,
      instant = false,
      badge,
      site_url,
      address,
      phone,
      inn,
      ogrn,
      license,
      info_modal,
      seo_description
    } = body

    const result = await query(
      `INSERT INTO mfo_companies 
       (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license, info_modal, seo_description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
       RETURNING *`,
      [name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license, info_modal, seo_description]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating MFO:', error)
    return NextResponse.json({ error: 'Failed to create MFO' }, { status: 500 })
  }
}

// PUT /api/mfo - Обновить MFO компанию
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      logo,
      rating,
      reviews,
      sum_min,
      sum_max,
      term_min,
      term_max,
      percent,
      first_free,
      instant,
      badge,
      site_url,
      address,
      phone,
      inn,
      ogrn,
      license,
      info_modal,
      seo_description,
      clicks,
      conversions
    } = body

    const result = await query(
      `UPDATE mfo_companies 
       SET name = $1, logo = $2, rating = $3, reviews = $4, sum_min = $5, sum_max = $6, 
           term_min = $7, term_max = $8, percent = $9, first_free = $10, instant = $11, 
           badge = $12, site_url = $13, address = $14, phone = $15, inn = $16, ogrn = $17, 
           license = $18, info_modal = $19, seo_description = $20, clicks = $21, conversions = $22, updated_at = CURRENT_TIMESTAMP
       WHERE id = $23 
       RETURNING *`,
      [name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, 
       badge, site_url, address, phone, inn, ogrn, license, info_modal, seo_description, clicks, conversions, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'MFO not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating MFO:', error)
    return NextResponse.json({ error: 'Failed to update MFO' }, { status: 500 })
  }
}

// DELETE /api/mfo - Удалить MFO компанию
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query('DELETE FROM mfo_companies WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'MFO not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'MFO deleted successfully' })
  } catch (error) {
    console.error('Error deleting MFO:', error)
    return NextResponse.json({ error: 'Failed to delete MFO' }, { status: 500 })
  }
}
