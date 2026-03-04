import { Metadata } from 'next'
import { Container, Typography, Grid, Link as MuiLink } from '@mui/material'

export const metadata: Metadata = {
  title: 'Карта сайта - все страницы NewPay',
  description: 'Полная карта сайта NewPay. Навигация по всем разделам: займы, кредитные карты, МФО, статьи, отзывы и FAQ.',
  openGraph: {
    title: 'Карта сайта NewPay',
    description: 'Полная навигация по сайту микрозаймов',
    type: 'website',
    url: 'https://NewPay.ru/sitemap',
    siteName: 'NewPay',
  },
}

export default function SitemapPage() {
  const mainPages = [
    { name: 'Главная', url: 'https://NewPay.ru' },
    { name: 'Займы онлайн', url: 'https://NewPay.ru/zajmy-online' },
    { name: 'Все МФО', url: 'https://NewPay.ru/allmfo' },
    { name: 'Кредитные карты', url: 'https://NewPay.ru/cards' },
    { name: 'Заявка на займ', url: 'https://NewPay.ru/zaim' },
    { name: 'Отзывы', url: 'https://NewPay.ru/reviews' },
    { name: 'Статьи', url: 'https://NewPay.ru/articles' },
    { name: 'FAQ', url: 'https://NewPay.ru/faq' },
    { name: 'О нас', url: 'https://NewPay.ru/about' },
    { name: 'Карта МФО', url: 'https://NewPay.ru/map' },
  ]

  const legalPages = [
    { name: 'Политика конфиденциальности', url: 'https://NewPay.ru/privacy' },
    { name: 'Пользовательское соглашение', url: 'https://NewPay.ru/terms' },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 800 }}>
        Карта сайта
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Полная навигация по сайту NewPay
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Основные страницы
          </Typography>
          {mainPages.map((page) => (
            <Typography key={page.url} variant="body1" sx={{ mb: 1 }}>
              <MuiLink href={page.url} underline="hover" color="primary">
                {page.name}
              </MuiLink>
            </Typography>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Информационные страницы
          </Typography>
          {legalPages.map((page) => (
            <Typography key={page.url} variant="body1" sx={{ mb: 1 }}>
              <MuiLink href={page.url} underline="hover" color="primary">
                {page.name}
              </MuiLink>
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}
