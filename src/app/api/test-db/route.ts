import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Проверим статьи
    const articles = await query('SELECT COUNT(*) as count FROM articles')
    const cards = await query('SELECT COUNT(*) as count FROM credit_cards')
    
    return NextResponse.json({ 
      success: true, 
      articles: articles.rows[0].count,
      cards: cards.rows[0].count
    })
  } catch (error: any) {
    console.error('DB Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      detail: error.detail
    }, { status: 500 })
  }
}