import { Metadata } from 'next'
import CardsContent from './CardsContent'

export const metadata: Metadata = {
  title: 'Кредитные карты с кэшбэком до 10%: лучшие предложения 2026 | NewPay',
  description: 'Выберите кредитную карту с максимальным кэшбэком и грейс-периодом до 120 дней. Оформите онлайн с бесплатной доставкой.',
  openGraph: {
    title: 'Кредитные карты с кэшбэком до 10% - выгодные предложения',
    description: 'Сравните лучшие кредитные карты с кэшбэком до 10% и грейс-периодом до 120 дней.',
    type: 'website',
    url: 'https://NewPay.ru/cards',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Кредитные карты - NewPay' }],
  },
}

export default function CardsPage() {
  return <CardsContent />
}
