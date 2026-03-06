import { Container, Typography, Box } from '@mui/material'
import { Metadata } from 'next'
import FAQContent from './FAQContent'

export const dynamic = 'force-static'
export const revalidate = 3600 // ISR: обновление каждый час

export const metadata: Metadata = {
  title: 'FAQ: ответы на вопросы о займах и кредитах | NewPay',
  description: 'Часто задаваемые вопросы: как взять займ, какие требования к заёмщику, как погасить займ без процентов. Экспертные ответы.',
  openGraph: {
    title: 'FAQ - Ответы на вопросы о займах',
    description: 'Все, что нужно знать о микрозаймах: требования, сроки, проценты.',
    type: 'website',
    url: 'https://NewPay.ru/faq',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FAQ NewPay' }],
  },
}

export default function FAQPage() {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800, display: { xs: 'none', md: 'block' } }}>
          Частые вопросы
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
          Ответы на популярные вопросы о микрозаймах и финансовых услугах
        </Typography>
        <FAQContent />
      </Container>
    </Box>
  )
}
