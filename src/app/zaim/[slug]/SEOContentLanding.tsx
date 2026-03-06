'use client'

import { useState, useEffect } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent, Button, Rating, Chip, CircularProgress } from '@mui/material'
import { SEOPageConfig } from '@/data/seo-pages-config'
import { MFO } from '@/data/mfo'
import Logo from '@/components/Logo'

interface SEOContentLandingProps {
  data: SEOPageConfig
}

export default function SEOContentLanding({ data }: SEOContentLandingProps) {
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
        
        {/* Ведущий текст - акцент на удобство и безопасность */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2, borderLeft: '4px solid #667eea' }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            {data.content.intro}
          </Typography>
        </Card>
        
        {/* Блок 3: Текст о льготах для льготных групп - акцент на доверие */}
        {data.content.specialText && (
          <Card sx={{ mb: 4, p: 3, borderRadius: 2, bgcolor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#2e7d32' }}>
              Особые условия для вас
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {data.content.specialText}
            </Typography>
          </Card>
        )}
        
        {/* Блок 1: Список МФО - меньше, акцент на надежность */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Проверенные МФО с высоким одобрением
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Мы отобрали организации с наиболее лояльными условиями для вашей ситуации
        </Typography>
        {!isLoaded ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mfoList.slice(0, 4).map((mfo) => (
            <Grid size={{ xs: 6, md: 3 }} key={mfo.id}>
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
                        до {mfo.sumMax.toLocaleString()} ₽
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Срок</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        до {mfo.termMax} дней
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
        
        {/* Информационный блок - почему выбирают нас */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Почему выбирают наш сервис
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Безопасность', desc: 'Ваши данные защищены современными протоколами шифрования' },
              { title: 'Скорость', desc: 'Одобрение за 5 минут, деньги на карту мгновенно' },
              { title: 'Прозрачность', desc: 'Никаких скрытых комиссий и платежей' },
              { title: 'Поддержка', desc: 'Поможем на каждом этапе оформления займа' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2, bgcolor: '#f8f9fa' }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: '#667eea',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    mx: 'auto',
                    mb: 2,
                  }}>
                    {i + 1}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* Блок 2: Таблица */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Условия займов
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>МФО</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Сумма</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Срок</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Ставка</th>
                </tr>
              </thead>
              <tbody>
                {mfoList.slice(0, 4).map((mfo, i) => (
                  <tr key={mfo.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{mfo.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>до {mfo.sumMax.toLocaleString()} ₽</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>до {mfo.termMax} дней</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#4caf50', fontWeight: 600 }}>от {mfo.percent}%/день</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>

        {/* Блок 4: Требования */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Что нужно для оформления
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
            {data.content.requirements}
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: '📋', text: 'Паспорт гражданина РФ' },
              { icon: '📱', text: 'Мобильный телефон' },
              { icon: '💳', text: 'Банковская карта' },
              { icon: '🏠', text: 'Постоянная регистрация' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography sx={{ fontSize: 24 }}>{item.icon}</Typography>
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* FAQ */}
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Вопросы и ответы
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
                { q: 'Какие шансы на одобрение?', a: 'Процент одобрения для данной категории заемщиков составляет более 80%. Мы подобрали наиболее лояльные МФО.' },
                { q: 'Влияет ли кредитная история?', a: 'Многие МФО из нашего списка специализируются на займах для клиентов с неидеальной кредитной историей.' },
                { q: 'Как быстро придут деньги?', a: 'После одобрения заявки деньги поступают на вашу карту в течение 5-15 минут.' },
              ].map((faq, i) => (
                <Box key={i} sx={{ mb: 3, pb: i < 2 ? 3 : 0, borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{faq.q}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{faq.a}</Typography>
                </Box>
              ))}
            </>
          )}
        </Card>

        {/* Вывод */}
        <Box sx={{ mt: 4, textAlign: 'center', p: 4, bgcolor: '#e8f5e9', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2e7d32' }}>
            Мы поможем вам получить деньги
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#333' }}>
            {data.content.conclusion || 'Заполните заявку в одной из проверенных МФО и получите решение уже через несколько минут.'}
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/allmfo"
            sx={{ 
              bgcolor: '#4caf50', 
              color: 'white',
              fontWeight: 700,
              px: 4,
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            Подобрать займ
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
