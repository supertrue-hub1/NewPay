'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Button, Slider, Chip, Rating } from '@mui/material'
import { useState } from 'react'
import { cities, getTopCities } from '@/data/cities'
import { useMfoData } from '@/data/mfo'
import Logo from '@/components/Logo'

const VISIBLE_COUNT = 12

// Тексты для гео-страниц
const geoTexts: Record<string, { hero: string; text: string; advantages: string[] }> = {
  default: {
    hero: 'Займы онлайн на карту — мгновенное одобрение',
    text: 'Получите деньги на карту за 5 минут. Мы подобрали лучшие предложения от проверенных МФО России. Без справок, без поручителей, с плохой кредитной историей.',
    advantages: ['Мгновенное одобрение', 'Перевод на любую карту', 'Без проверки КИ', 'Работаем 24/7'],
  },
  moskva: {
    hero: 'Займы онлайн в Москве — деньги за 5 минут',
    text: 'Жители Москвы могут получить перевод на карту за 5 минут. Более 50 МФО готовы выдать займ без отказа. Доставка денег возможна в любой район города.',
    advantages: ['Мгновенный перевод на карту', 'Без посещения офиса', 'Круглосуточное оформление', 'Персональные условия'],
  },
  'sankt-peterburg': {
    hero: 'Займы онлайн в Санкт-Петербурге — быстрые деньги',
    text: 'Жители Санкт-Петербурга могут оформить займ онлайн и получить деньги на карту за 5 минут. Работаем со всеми банками России.',
    advantages: ['Одобрение за 2 минуты', 'Перевод на карту Сбербанка', 'Без справок о доходах', 'Первый займ 0%'],
  },
  novosibirsk: {
    hero: 'Займы онлайн в Новосибирске — срочно и без отказа',
    text: 'Новосибирцы могут получить займ на карту через 5 минут после подачи заявки. Более 30 проверенных МФО с лучшими условиями.',
    advantages: ['Быстрое одобрение', 'На любую карту', 'С плохой КИ', 'Первый займ бесплатно'],
  },
  ekaterinburg: {
    hero: 'Займы онлайн в Екатеринбурге — деньги за 5 минут',
    text: 'Жители Екатеринбурга могут оформить микрозайм онлайн. Мы подобрали лучшие предложения с мгновенным переводом на карту.',
    advantages: ['За 5 минут на карту', 'Без отказа', 'Круглосуточно', '0% первый займ'],
  },
  kazan: {
    hero: 'Займы онлайн в Казани — быстрые микрозаймы',
    text: 'Оформите займ онлайн в Казани. Перевод на карту за 5 минут. Работаем со всеми банками Татарстана.',
    advantages: ['Мгновенное одобрение', 'Без справок', 'На любую карту', 'С плохой историей'],
  },
}

const getGeoText = (slug: string) => {
  return geoTexts[slug] || {
    hero: `Займы онлайн ${geoTexts.default.hero.split('—')[0]}`,
    text: `Жители города могут получить займ на карту за 5 минут. Оформите онлайн-заявку и получите деньги мгновенно.`,
    advantages: geoTexts.default.advantages,
  }
}

export default function CitiesContent() {
  const { mfoData, isLoaded } = useMfoData()
  const topCities = getTopCities(10)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  
  const [sum, setSum] = useState(10000)
  const [days, setDays] = useState(7)

  const [showAll, setShowAll] = useState(false)

  const handleCityClick = (slug: string) => {
    window.location.href = `/zajmy-online/${slug}`
  }

  const geoText = selectedCity ? getGeoText(selectedCity) : geoTexts.default

  // Показываем первые 12 или все
  const visibleMfo = showAll ? mfoData : mfoData.slice(0, VISIBLE_COUNT)

  // Генерация JSON-LD схемы для страницы займов
  const generateLoansJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      'name': 'Займы онлайн на карту',
      'description': 'Срочный займ онлайн на любую карту. Без проверки кредитной истории, с моментальным решением. Первый займ под 0%!',
      'provider': {
        '@type': 'Organization',
        'name': 'NewPay',
        'url': 'https://NewPay.ru'
      },
      'offers': {
        '@type': 'AggregateOffer',
        'lowPrice': 1000,
        'highPrice': 50000,
        'priceCurrency': 'RUB',
        'offerCount': mfoData.length,
        'description': 'Займы от 1000 до 50000 рублей на срок от 1 до 30 дней'
      },
      'additionalProperty': [
        {
          '@type': 'PropertyValue',
          'name': 'Время рассмотрения',
          'value': '5 минут'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Первый займ',
          'value': '0%'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Выдача',
          'value': 'На любую карту'
        }
      ],
      'category': 'https://schema.org/LoanOrCredit'
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateLoansJsonLd()) }} />
      <Box sx={{ pt: 14, pb: 8, minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        {/* Hero блок */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 42 }, fontWeight: 700, mb: 2, color: '#1e293b' }}>
            {geoText.hero}
          </Typography>
          <Typography sx={{ fontSize: { xs: 16, md: 18 }, color: '#64748b', maxWidth: 700, mx: 'auto' }}>
            {geoText.text}
          </Typography>
        </Box>

        {/* Преимущества */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {geoText.advantages.map((adv, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <Card sx={{ textAlign: 'center', py: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600, color: '#4f46e5' }}>{adv}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Калькулятор */}
        <Card sx={{ mb: 6, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Подберите займ
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Сумма: {sum.toLocaleString()} ₽</Typography>
              <Slider
                value={sum}
                onChange={(_, v) => setSum(v as number)}
                min={1000}
                max={50000}
                step={1000}
                sx={{ color: '#4f46e5' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                <span>1 000 ₽</span>
                <span>50 000 ₽</span>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Срок: {days} дней</Typography>
              <Slider
                value={days}
                onChange={(_, v) => setDays(v as number)}
                min={1}
                max={30}
                step={1}
                sx={{ color: '#4f46e5' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                <span>1 день</span>
                <span>30 дней</span>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              К возврату: <span style={{ color: '#4f46e5' }}>{Math.round(sum * (1 + days * 0.01)).toLocaleString()} ₽</span>
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>при 1% в день</Typography>
          </Box>
        </Card>

        {/* Список городов */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Выберите ваш город
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {topCities.map((city) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={city.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  borderRadius: 3, 
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(79, 70, 229, 0.15)' }
                }}
                onClick={() => handleCityClick(city.slug)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{city.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>{(city.population / 1000000).toFixed(1)} млн</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Все города */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Займы во всех городах России
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 6 }}>
          {cities.map((city) => (
            <Button
              key={city.id}
              variant="outlined"
              size="small"
              href={`/zajmy-online/${city.slug}`}
              sx={{ 
                borderRadius: 2, 
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': { borderColor: '#4f46e5', color: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.04)' }
              }}
            >
              {city.name}
            </Button>
          ))}
        </Box>

        {/* МФО карточками */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Лучшие МФО для займа
        </Typography>
        
        <Grid container spacing={2}>
          {visibleMfo.map((mfo) => (
            <Grid size={{ xs: 6, md: 3 }} key={mfo.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  width: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Logo logo={mfo.logo} size={50} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{mfo.name}</Typography>
                      </Box>
                    </Box>
                    {mfo.badge && <Chip label={mfo.badge} color="success" size="small" />}
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Сумма</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Срок</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mfo.termMin}-{mfo.termMax} дней
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Ставка</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {mfo.percent}% в день
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Вероятность</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Высокая</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {mfo.firstFree && <Chip label="Первый займ 0%" color="primary" size="small" />}
                    {mfo.instant && <Chip label="Мгновенно" size="small" />}
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      href={mfo.siteUrl || '#'}
                      target="_blank"
                      sx={{ bgcolor: '#4caf50', borderRadius: 2, '&:hover': { bgcolor: '#388e3c' } }}
                    >
                      Получить деньги
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Кнопка показать все */}
        {!showAll && mfoData.length > VISIBLE_COUNT && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              href="/allmfo"
              sx={{ 
                bgcolor: '#4f46e5', 
                px: 6,
                py: 1.5,
                borderRadius: 3,
                fontSize: 16,
                fontWeight: 600,
                '&:hover': { bgcolor: '#4338ca' }
              }}
            >
              Посмотреть все предложения ({mfoData.length})
            </Button>
          </Box>
        )}
      </Container>
    </Box>
    </>
  )
}
