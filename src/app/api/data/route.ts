import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'mfo'

  // Для демонстрации возвращаем статические данные
  // В реальном проекте нужен бэкенд с БД
  const { mfoData } = await import('@/data/mfo-data')
  const { cardsData } = await import('@/data/cards-data')
  const { articlesData } = await import('@/data/articles-data')
  const { faqData } = await import('@/data/faq-data')

  switch (type) {
    case 'mfo':
      return NextResponse.json(mfoData)
    case 'cards':
      return NextResponse.json(cardsData)
    case 'articles':
      return NextResponse.json(articlesData)
    case 'faq':
      return NextResponse.json(faqData)
    default:
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }
}
