import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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

// Функция создания таблицы карт
async function createCardsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS credit_cards (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      bank VARCHAR(255),
      logo VARCHAR(255),
      rating DECIMAL(3,2) DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      cashback INTEGER DEFAULT 0,
      grace_period INTEGER DEFAULT 0,
      annual_fee INTEGER DEFAULT 0,
      "limit" INTEGER DEFAULT 0,
      percent DECIMAL(5,2) DEFAULT 0,
      badge VARCHAR(255),
      features TEXT[],
      site_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// GET /api/cards - получить все карты
export async function GET() {
  try {
    const result = await query('SELECT * FROM credit_cards ORDER BY rating DESC')
    if (result.rows && result.rows.length > 0) {
      return NextResponse.json(result.rows)
    }
    // Если данных нет в БД
    return NextResponse.json([])
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    
    // Если таблицы нет - создаём
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      try {
        await createCardsTable()
        return NextResponse.json([])
      } catch (createError) {
        console.error('Error creating cards table:', createError)
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

// POST /api/cards - создать карту
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      bank,
      logo,
      rating = 0,
      reviews = 0,
      cashback = 0,
      grace_period = 0,
      annual_fee = 0,
      limit = 0,
      percent = 0,
      badge,
      features,
      site_url
    } = body

    const result = await query(
      `INSERT INTO credit_cards (name, bank, logo, rating, reviews, cashback, grace_period, annual_fee, "limit", percent, badge, features, site_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [name, bank, logo, rating, reviews, cashback, grace_period, annual_fee, limit, percent, badge, features, site_url]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    
    // Если таблицы нет - создаём и пробуем снова
    if (error instanceof Error && error.message?.includes('relation') && error.message?.includes('does not exist')) {
      try {
        await createCardsTable()
        
        // Повторяем вставку
        const body = await request.json()
        const { name, bank, logo, rating, reviews, cashback, grace_period, annual_fee, limit, percent, badge, features, site_url } = body
        
        const result = await query(
          `INSERT INTO credit_cards (name, bank, logo, rating, reviews, cashback, grace_period, annual_fee, "limit", percent, badge, features, site_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
          [name, bank, logo, rating || 0, reviews || 0, cashback || 0, grace_period || 0, annual_fee || 0, limit || 0, percent || 0, badge, features, site_url]
        )
        
        return NextResponse.json(result.rows[0], { status: 201 })
      } catch (createError) {
        console.error('Error creating table:', createError)
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}

// PUT /api/cards - обновить карту
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      bank,
      logo,
      rating,
      reviews,
      cashback,
      grace_period,
      annual_fee,
      limit,
      percent,
      badge,
      features,
      site_url
    } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query(
      `UPDATE credit_cards 
       SET name = $1, bank = $2, logo = $3, rating = $4, reviews = $5, cashback = $6, 
           grace_period = $7, annual_fee = $8, "limit" = $9, percent = $10, badge = $11, 
           features = $12, site_url = $13, updated_at = CURRENT_TIMESTAMP
       WHERE id = $14 
       RETURNING *`,
      [name, bank, logo, rating, reviews, cashback, grace_period, annual_fee, limit, percent, badge, features, site_url, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating card:', error)
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}

// DELETE /api/cards - удалить карту
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query('DELETE FROM credit_cards WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Card deleted successfully' })
  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}
