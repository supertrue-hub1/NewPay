import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Статические данные FAQ как fallback
const staticFaqData = [
  { id: 1, question: 'Как получить займ?', answer: 'Для получения займа необходимо заполнить заявку на сайте МФО, указав паспортные данные и реквизиты банковской карты. Решение принимается в течение нескольких минут.' },
  { id: 2, question: 'Какие требования к заёмщику?', answer: 'Основные требования: возраст от 18 до 75 лет, гражданство РФ, постоянная регистрация, наличие действующего паспорта и банковской карты.' },
  { id: 3, question: 'Можно ли получить займ с плохой кредитной историей?', answer: 'Да, многие МФО выдают займы клиентам с плохой кредитной историей. Однако это может повлиять на условия займа.' },
  { id: 4, question: 'Как погасить займ?', answer: 'Погасить займ можно через личный кабинет на сайте МФО, через банковское приложение, в терминалах оплаты или в отделениях банков.' },
  { id: 5, question: 'Что делать при просрочке?', answer: 'При возникновении просрочки необходимо связаться с МФО для урегулирования ситуации. Просрочка влечёт начисление штрафных процентов.' },
]

// GET /api/faq - Получить все FAQ
export async function GET() {
  try {
    const result = await query('SELECT * FROM faq ORDER BY id')
    if (result.rows && result.rows.length > 0) {
      return NextResponse.json(result.rows)
    }
    // Если данных нет в БД - возвращаем статические
    return NextResponse.json(staticFaqData)
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    // При ошибке возвращаем статические данные вместо 500
    return NextResponse.json(staticFaqData)
  }
}

// POST /api/faq - Добавить новый FAQ
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO faq (question, answer) VALUES ($1, $2) RETURNING *',
      [question, answer]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}

// PUT /api/faq - Обновить FAQ
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, question, answer } = body

    if (!id || !question || !answer) {
      return NextResponse.json({ error: 'ID, question and answer are required' }, { status: 400 })
    }

    const result = await query(
      'UPDATE faq SET question = $1, answer = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [question, answer, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}

// DELETE /api/faq - Удалить FAQ
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const result = await query('DELETE FROM faq WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }
}
