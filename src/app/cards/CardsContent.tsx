'use client'

import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button, Rating } from '@mui/material'
import Logo from '@/components/Logo'
import { cardsData } from '@/data/cards-data'

// Генерация JSON-LD схемы для кредитных карт
function generateCardsJsonLd(cards: typeof cardsData) {
  const maxCashback = Math.max(...cards.map(c => c.cashback))
  const maxGrace = Math.max(...cards.map(c => c.gracePeriod))
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': 'Кредитные карты с кэшбэком',
    'description': `Лучшие кредитные карты с кэшбэком до ${maxCashback}% и грейс-периодом до ${maxGrace} дней. Оформите онлайн с бесплатной доставкой.`,
    'provider': {
      '@type': 'Organization',
      'name': 'NewPay',
      'url': 'https://NewPay.ru'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'lowPrice': 0,
      'highPrice': Math.max(...cards.map(c => c.limit)),
      'priceCurrency': 'RUB',
      'offerCount': cards.length,
      'description': `Кредитные карты от ${cards.length} банков России`
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Максимальный кэшбэк',
        'value': `${maxCashback}%`
      },
      {
        '@type': 'PropertyValue',
        'name': 'Максимальный грейс-период',
        'value': `${maxGrace} дней`
      },
      {
        '@type': 'PropertyValue',
        'name': 'Доставка',
        'value': 'Бесплатно'
      }
    ],
    'category': 'https://schema.org/CreditCard'
  }
}

export default function CardsContent() {
  const jsonLd = generateCardsJsonLd(cardsData)
  
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
          Кредитные карты
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Сравните лучшие кредитные карты с кэшбэком и грейс-периодом
        </Typography>

        <Grid container spacing={3}>
          {cardsData.map((card) => (
            <Grid size={{ xs: 12, md: 6 }} key={card.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Logo logo={card.logo} size={50} color="#e53935" />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{card.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{card.bank}</Typography>
                      </Box>
                    </Box>
                    {card.badge && <Chip label={card.badge} color="success" size="small" />}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={card.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({card.reviews.toLocaleString()} отзывов)
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Кэшбэк</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        до {card.cashback}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Грейс-период</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {card.gracePeriod} дней
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Годовая плата</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {card.annualFee === 0 ? 'Бесплатно' : `${card.annualFee} ₽`}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Лимит</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        до {card.limit.toLocaleString()} ₽
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Особенности:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {card.features.map((feature, idx) => (
                        <Chip key={idx} label={feature} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Button variant="contained" fullWidth sx={{ bgcolor: '#1a237e' }}>
                    Оформить карту
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    </>
  )
}
