import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Предоставляем права на все таблицы
    await query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO adminmfo')
    await query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO adminmfo')
    
    return NextResponse.json({ success: true, message: 'Права предоставлены' })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
