import { Metadata } from 'next'
import ReviewsContent from './ReviewsContent'

export const metadata: Metadata = {
  title: 'Отзывы клиентов о займах: реальные мнения 500 000+ пользователей | NewPay',
  description: 'Честные отзывы клиентов о МФО и займах на карту. Узнайте правду о микрозаймах от реальных людей. Рейтинг МФО по отзывам.',
  openGraph: {
    title: 'Отзывы о займах - честные мнения клиентов',
    description: 'Реальные отзывы о микрозаймах от более чем 500 000 пользователей. Узнайте, какие МФО лучше.',
    type: 'website',
    url: 'https://NewPay.ru/reviews',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Отзывы клиентов' }],
  },
}

export default function ReviewsPage() {
  return <ReviewsContent />
}
