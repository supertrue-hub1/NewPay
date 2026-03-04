import { Metadata } from 'next'
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material'
import { VerifiedUser, Speed, Support, TrendingUp } from '@mui/icons-material'

export const metadata: Metadata = {
  title: 'О сервисе newpay: как мы помогаем получить займ за 5 минут с гарантией 99%',
  description: 'Узнайте, почему 500 000+ пользователей выбирают newpay. Честные отзывы, проверенные МФО, мгновенное одобрение. Наша миссия — финансовая свобода каждого!',
  openGraph: {
    title: 'О newpay - сервисе подбора займов №1 в России',
    description: 'Мы помогли получить займ более 500 000 человек. Честные отзывы, проверенные МФО, гарантия одобрения 99%.',
    type: 'website',
    url: 'https://newpay.ru/about',
    siteName: 'newpay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'О newpay' }],
  },
}

export default function AboutPage() {
  return (
    <>
      <Box sx={{ pt: 8, pb: 8, minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
            О сервисе newpay
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary' }}>
              Сервис «newpay» — это современная платформа для подбора микрозаймов от ведущих микрофинансовых организаций России. Мы помогаем пользователям быстро найти выгодные условия кредитования и оформить займ онлайн на карту.

              Наша миссия — сделать процесс получения займов максимально простым, прозрачным и безопасным. Мы сотрудничаем только с лицензированными МФО, которые прошли тщательную проверку и имеют положительную репутацию на рынке финансовых услуг.
            </Typography>
          </Paper>

          <Button
            variant="contained"
            href="/allmfo"
            fullWidth
            size="large"
            sx={{ 
              mt: 4, 
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd6' }
            }}
          >
            Подобрать займ онлайн
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1a237e', mt: 6 }}>
            Почему выбирают нас
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VerifiedUser sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Проверенные МФО</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Все микрофинансовые организации на нашем сервисе имеют действующие лицензии ЦБ РФ и прошли проверку на надёжность.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Speed sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Быстрое оформление</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Заявка на займ рассматривается в течение нескольких минут. Деньги зачисляются на банковскую карту мгновенно после одобрения.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Support sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Поддержка 24/7</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Наша служба поддержки готова помочь вам в любое время. Отвечаем на вопросы и помогаем с оформлением займа.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Лучшие условия</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Мы собираем актуальные предложения от МФО и помогаем выбрать оптимальный займ с минимальной процентной ставкой.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
