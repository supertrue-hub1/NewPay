import { Metadata } from 'next'
import { Container, Typography, Box, Paper, Grid } from '@mui/material'

export const metadata: Metadata = {
  title: 'Карта МФО России: точки выдачи займов в городах | NewPay',
  description: 'Интерактивная карта присутствия микрофинансовых организаций. Найдите ближайшие офисы МФО в вашем городе. Займы без отказа!',
  openGraph: {
    title: 'Карта МФО России - точки выдачи займов',
    description: 'Интерактивная карта микрофинансовых организаций. Найдите офисы МФО рядом с вами.',
    type: 'website',
    url: 'https://NewPay.ru/map',
    siteName: 'NewPay',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Карта МФО' }],
  },
}

export default function MapPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 800 }}>
        Карта присутствия МФО в России
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Интерактивная карта точек выдачи займов микрофинансовых организаций
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
              50+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Точек на карте
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          О карте
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          На данной карте отображены точки присутствия микрофинансовых организаций (МФО) в России.
        </Typography>
      </Paper>
    </Container>
  )
}
