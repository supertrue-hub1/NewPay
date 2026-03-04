import { Metadata } from 'next'
import HomeContent from './HomeContent'

// ISR: обновление страницы каждый час
export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Займ на карту за 5 минут: Топ-10 МФО с одобрением 99% | NewPay',
  description: 'Срочный займ на карту без отказа! Мгновенное одобрение за 5 минут, перевод на любую карту. Выберите лучшие МФО с 0% на первый займ.',
  openGraph: {
    title: 'Займ на карту за 5 минут - 99% одобрение | NewPay',
    description: 'Срочный займ на карту без отказа! Мгновенное одобрение за 5 минут. Первый займ 0%!',
    type: 'website',
    url: 'https://NewPay.ru',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NewPay - Займы онлайн' }],
  },
}

export default function HomePage() {
  return <HomeContent />
}
