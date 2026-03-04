import { Metadata } from 'next'
import { Container } from '@mui/material'
import PrivacyContent from './PrivacyContent'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Политика конфиденциальности NewPay: как мы защищаем ваши данные',
  description: 'Политика конфиденциальности сервиса подбора микрозаймов NewPay. Узнайте, как мы защищаем ваши персональные данные и обеспечиваем безопасность.',
  openGraph: {
    title: 'Политика конфиденциальности NewPay',
    description: 'Мы заботимся о безопасности ваших данных. Узнайте больше о нашей политике конфиденциальности.',
    type: 'website',
    url: 'https://NewPay.ru/privacy',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Политика конфиденциальности' }],
  },
}

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6, pt: '120px' }} suppressHydrationWarning>
      <PrivacyContent />
    </Container>
  )
}
