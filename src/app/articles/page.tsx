import { Metadata } from 'next'
import ArticlesContent from './ArticlesContent'

export const metadata: Metadata = {
  title: 'Финансовый блог: советы по займам, кредитам и управлению деньгами | NewPay',
  description: 'Экспертные статьи о микрозаймах, кредитных картах и личных финансах. Узнайте, как экономить на процентах и правильно брать займы.',
  openGraph: {
    title: 'Финансовый блог NewPay - экспертные советы',
    description: 'Полезные статьи о займах, кредитах и управлении личными финансами.',
    type: 'website',
    url: 'https://NewPay.ru/articles',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Блог NewPay' }],
  },
}

export default function ArticlesPage() {
  return <ArticlesContent />
}
