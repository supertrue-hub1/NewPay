import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/partners/setup - Создать таблицу partners (однократно)
export async function GET() {
  try {
    // Создание таблицы
    await query(`
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
    await query(`CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active)`)

    // Seed данные (если таблица пустая)
    const existing = await query('SELECT COUNT(*) as count FROM partners')
    if (parseInt(existing.rows[0].count) === 0) {
      await query(`
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

    return NextResponse.json({ success: true, message: 'Таблица partners создана' })
  } catch (error) {
    console.error('Error setting up partners:', error)
    return NextResponse.json({ error: 'Failed to setup partners', details: String(error) }, { status: 500 })
  }
}
