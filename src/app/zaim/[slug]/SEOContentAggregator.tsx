'use client'

import { useState, useEffect } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent, Button, Rating, Chip, CircularProgress } from '@mui/material'
import { SEOPageConfig } from '@/data/seo-pages-config'
import { MFO } from '@/data/mfo'
import Logo from '@/components/Logo'

interface SEOContentAggregatorProps {
  data: SEOPageConfig
}

export default function SEOContentAggregator({ data }: SEOContentAggregatorProps) {
  const [mfoList, setMfoList] = useState<MFO[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadMfo = async () => {
      try {
        const res = await fetch('/api/mfo')
        if (res.ok) {
          const result = await res.json()
          const converted: MFO[] = result.map((item: any) => ({
            id: item.id,
            name: item.name,
            logo: item.logo,
            rating: parseFloat(item.rating),
            reviews: item.reviews,
            sumMin: item.sum_min,
            sumMax: item.sum_max,
            termMin: item.term_min,
            termMax: item.term_max,
            percent: parseFloat(item.percent),
            firstFree: item.first_free,
            instant: item.instant,
            badge: item.badge,
            siteUrl: item.site_url,
            address: item.address,
            phone: item.phone,
            inn: item.inn,
            ogrn: item.ogrn,
            license: item.license,
          }))
          setMfoList(converted)
        }
      } catch (e) {
        console.error('Error loading MFO:', e)
      }
      setIsLoaded(true)
    }
    loadMfo()
  }, [])

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* H1 */}
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 800,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            lineHeight: 1.2
          }}
        >
          {data.h1}
        </Typography>
        
        {/* Ведущий текст - о способе получения */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            {data.content.intro}
          </Typography>
        </Card>
        
        {/* Блок 1: Список МФО */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          ТОП МФО для оформления займа
        </Typography>
        {!isLoaded ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mfoList.slice(0, 8).map((mfo) => (
            <Grid size={{ xs: 12, md: 3 }} key={mfo.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer', 
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Logo logo={mfo.logo} size={50} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{mfo.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={mfo.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            ({mfo.reviews.toLocaleString()} отзывов)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {mfo.badge && (
                      <Chip label={mfo.badge} color="success" size="small" />
                    )}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
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
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Высокая
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {mfo.firstFree && <Chip label="Первый 0%" color="primary" size="small" />}
                    {mfo.instant && <Chip label="Мгновенно" size="small" />}
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 2, bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                    href={mfo.siteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Получить деньги
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
        
        {/* Блок 2: Таблица ставок */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Таблица ставок и сроков
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>МФО</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Сумма</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Срок</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Ставка</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Первый займ</th>
                </tr>
              </thead>
              <tbody>
                {mfoList.slice(0, 5).map((mfo, i) => (
                  <tr key={mfo.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.termMin}-{mfo.termMax} дней</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#4caf50', fontWeight: 600 }}>{mfo.percent}%/день</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.firstFree ? '0%' : 'От ' + mfo.percent + '%'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>
        
        {/* Блок 4: Требования */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Требования и документы
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
            {data.content.requirements}
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: '✓', text: 'Гражданство РФ' },
              { icon: '✓', text: 'Возраст от 18 до 85 лет' },
              { icon: '✓', text: 'Паспорт РФ' },
              { icon: '✓', text: 'Постоянная регистрация' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#4caf50', fontWeight: 700 }}>{item.icon}</Typography>
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* FAQ */}
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Часто задаваемые вопросы
          </Typography>
          {data.content.faq.length > 0 ? (
            data.content.faq.map((faq, i) => (
              <Box key={i} sx={{ mb: 3, pb: i < data.content.faq.length - 1 ? 3 : 0, borderBottom: i < data.content.faq.length - 1 ? '1px solid #eee' : 'none' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{faq.question}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{faq.answer}</Typography>
              </Box>
            ))
          ) : (
            <>
              {[
                { q: 'Как быстро придут деньги?', a: 'После одобрения заявки деньги поступают на указанный счет в течение 1-15 минут.' },
                { q: 'Какая максимальная сумма займа?', a: 'Максимальная сумма зависит от МФО и вашей кредитной истории. Обычно до 30 000-100 000 рублей.' },
                { q: 'Можно ли продлить займ?', a: 'Да, большинство МФО предоставляют услугу пролонгации (продления) займа.' },
              ].map((faq, i) => (
                <Box key={i} sx={{ mb: 3, pb: i < 2 ? 3 : 0, borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{faq.q}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{faq.a}</Typography>
                </Box>
              ))}
            </>
          )}
        </Card>

        {/* Вывод / CTA */}
        <Box sx={{ mt: 4, textAlign: 'center', p: 4, bgcolor: '#667eea', borderRadius: 3, color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Готовы оформить займ?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {data.content.conclusion || 'Выберите лучшее предложение выше и получите деньги уже сегодня!'}
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/allmfo"
            sx={{ 
              bgcolor: 'white', 
              color: '#667eea',
              fontWeight: 700,
              px: 4,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            Выбрать займ
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
