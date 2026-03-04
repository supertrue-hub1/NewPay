import { Metadata } from 'next'
import CitiesContent from './CitiesContent'

export const metadata: Metadata = {
  title: 'Займы онлайн на карту за 5 минут - мгновенное одобрение 24/7 | NewPay',
  description: 'Срочный займ онлайн на любую карту. Без проверки кредитной истории, с моментальным решением. Первый займ под 0%!',
  openGraph: {
    title: 'Займы онлайн - деньги за 5 минут',
    description: 'Срочные займы на карту с мгновенным одобрением. Первый займ 0%!',
    type: 'website',
    url: 'https://NewPay.ru/zajmy-online',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Займы онлайн - NewPay' }],
  },
}

export default function ZajmyOnlinePage() {
  return <CitiesContent />
}
