import { Metadata } from 'next'
import AllMfoContent from './AllMfoContent'

export const metadata: Metadata = {
  title: 'Все МФО 2026: лучшие займы с мгновенным одобрением | newpay',
  description: 'Полный каталог МФО России. Сравните процентные ставки, условия выдачи и отзывы. Выберите лучший займ с гарантированным одобрением.',
  openGraph: {
    title: 'Все МФО России - выберите лучший займ',
    description: 'Сравните все микрофинансовые организации и выберите займ с самыми выгодными условиями.',
    type: 'website',
    url: 'https://newpay.ru/allmfo',
    siteName: 'newpay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Все МФО - newpay' }],
  },
}

export default function AllMfoPage() {
  return <AllMfoContent />
}
