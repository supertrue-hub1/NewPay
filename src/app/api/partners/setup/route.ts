import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Используем суперпользователя для создания таблицы
const adminPool = new Pool({
  user: 'postgres',
  password: process.env.DB_PASSWORD || '546815hH!',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'my_mfo',
})

const adminQuery = async (text: string, params?: any[]) => {
  const client = await adminPool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

// GET /api/partners/setup - Создать таблицу partners (однократно)
export async function GET() {
  try {
    // Создание таблицы
    await adminQuery(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        image_url VARCHAR(500),
        link VARCHAR(500),
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Индексы
    await adminQuery(`CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order)`)
    await adminQuery(`CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active)`)

    // Seed данные (если таблица пустая)
    const existing = await adminQuery('SELECT COUNT(*) as count FROM partners')
    if (parseInt(existing.rows[0].count) === 0) {
      await adminQuery(`
        INSERT INTO partners (name, slug, description, image_url, link, category, is_active, sort_order) VALUES
        ('Сбербанк', 'sberbank', 'Крупнейший банк России', 'https://logo.clearbit.com/sberbank.ru', 'https://sberbank.ru', 'Банк', true, 1),
        ('Тинькофф', 'tinkoff', 'Банк без отделений', 'https://logo.clearbit.com/tinkoff.ru', 'https://tinkoff.ru', 'Банк', true, 2),
        ('Альфа-Банк', 'alfabank', 'Универсальный банк', 'https://logo.clearbit.com/alfabank.ru', 'https://alfabank.ru', 'Банк', true, 3),
        ('ВТБ', 'vtb', 'Государственный банк', 'https://logo.clearbit.com/vtb.ru', 'https://vtb.ru', 'Банк', true, 4),
        ('Почта Банк', 'pochtabank', 'Банк с отделениями в почте', 'https://logo.clearbit.com/pochtabank.ru', 'https://pochtabank.ru', 'Банк', true, 5),
        ('Росбанк', 'rosbank', 'Частный универсальный банк', 'https://logo.clearbit.com/rosbank.ru', 'https://rosbank.ru', 'Банк', true, 6),
        ('МТС Банк', 'mtsbank', 'Банк от МТС', 'https://logo.clearbit.com/mtsbank.ru', 'https://mtsbank.ru', 'Банк', true, 7),
        ('ОТП Банк', 'otpbank', 'Венгерский банк в России', 'https://logo.clearbit.com/otpbank.ru', 'https://otpbank.ru', 'Банк', true, 8)
      `)
    }

    await adminPool.end()
    return NextResponse.json({ success: true, message: 'Таблица partners создана' })
  } catch (error) {
    console.error('Error setting up partners:', error)
    await adminPool.end()
    return NextResponse.json({ error: 'Failed to setup partners', details: String(error) }, { status: 500 })
  }
}
