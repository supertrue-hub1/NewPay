import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Проверяем какие таблицы существуют
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    // Пробуем создать таблицы если их нет
    const results = []
    
    // Таблица статей
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
          author VARCHAR(255) DEFAULT 'Редакция',
          author_id INTEGER,
          status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
          views INTEGER DEFAULT 0,
          reading_time INTEGER DEFAULT 5,
          tags TEXT[],
          seo_title VARCHAR(500),
          seo_description VARCHAR(500),
          seo_og_image VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      results.push({ table: 'articles', created: true })
    } catch (e: any) {
      results.push({ table: 'articles', error: e.message })
    }
    
    // Таблица карт
    try {
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
          limit INTEGER DEFAULT 0,
          percent DECIMAL(5,2) DEFAULT 0,
          badge VARCHAR(255),
          features TEXT[],
          site_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      results.push({ table: 'credit_cards', created: true })
    } catch (e: any) {
      results.push({ table: 'credit_cards', error: e.message })
    }
    
    return NextResponse.json({
      success: true,
      existingTables: tables.rows.map((t: any) => t.table_name),
      results
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
