import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    })
    
    const result = await query('SELECT NOW() as time')
    return NextResponse.json({ 
      success: true, 
      time: result.rows[0].time,
      dbConfig: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
      }
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