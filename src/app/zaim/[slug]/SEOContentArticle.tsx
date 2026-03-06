'use client'

import { useState, useEffect } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent, Button, Rating, Chip, CircularProgress, Divider } from '@mui/material'
import { SEOPageConfig } from '@/data/seo-pages-config'
import { MFO } from '@/data/mfo'
import Logo from '@/components/Logo'
import Link from 'next/link'

interface SEOContentArticleProps {
  data: SEOPageConfig
}

export default function SEOContentArticle({ data }: SEOContentArticleProps) {
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
        
        {/* SEO-текст: основной контент статьи */}
        <Card sx={{ mb: 4, p: 4, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.9, fontSize: '1.05rem', mb: 3 }}>
            {data.content.intro}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Блок с МФО внутри текста */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Рекомендуемые МФО
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ниже представлены организации, которые соответствуют вашему запросу:
          </Typography>
          
          {!isLoaded ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {mfoList.slice(0, 4).map((mfo) => (
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
                            {mfo.seoDescription && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {mfo.seoDescription}
                              </Typography>
                            )}
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
          
          {/* Текстовое описание преимуществ */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Почему стоит воспользоваться этим способом
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
            Современные микрофинансовые организации предлагают удобные решения для получения денежных средств. 
            Благодаря развитию технологий, процесс оформления займа стал максимально простым и доступным. 
            Вам не нужно посещать офис, собирать справки или ждать несколько дней на рассмотрение заявки.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
            Ключевые преимущества: мгновенное решение (от 1 минуты), минимальный пакет документов (только паспорт), 
            возможность получить деньги на любую банковскую карту, круглосуточное рассмотрение заявок.
          </Typography>
        </Card>
        
        {/* Блок 4: Требования */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Основные требования к заемщику
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
            {data.content.requirements}
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: '✓', text: 'Гражданство Российской Федерации', color: '#4caf50' },
              { icon: '✓', text: 'Возраст от 18 до 85 лет', color: '#4caf50' },
              { icon: '✓', text: 'Паспорт РФ (основной документ)', color: '#4caf50' },
              { icon: '✓', text: 'Постоянная регистрация в РФ', color: '#4caf50' },
              { icon: '✓', text: 'Действующий номер телефона', color: '#4caf50' },
              { icon: '✓', text: 'Банковская карта Visa/MasterCard/МИР', color: '#4caf50' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: item.color, fontWeight: 700, fontSize: 18 }}>{item.icon}</Typography>
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* Таблица условий */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Сравнение условий
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>МФО</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Сумма</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Срок</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Ставка</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Особенности</th>
                </tr>
              </thead>
              <tbody>
                {mfoList.slice(0, 4).map((mfo, i) => (
                  <tr key={mfo.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{mfo.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{mfo.termMin}-{mfo.termMax} дней</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#4caf50', fontWeight: 600 }}>{mfo.percent}%/день</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                      {mfo.firstFree && <Chip label="0%" size="small" color="primary" sx={{ mr: 0.5 }} />}
                      {mfo.instant && <Chip label="Мгновенно" size="small" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>
        
        {/* FAQ - расширенный */}
        <Card sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Часто задаваемые вопросы
          </Typography>
          {data.content.faq.length > 0 ? (
            data.content.faq.map((faq, i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#667eea' }}>
                  ❓ {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, pl: 2, borderLeft: '3px solid #667eea', py: 1 }}>
                  {faq.answer}
                </Typography>
              </Box>
            ))
          ) : (
            <>
              {[
                { q: 'Как правильно выбрать МФО?', a: 'При выборе МФО обращайте внимание на: процентную ставку, максимальную сумму займа, сроки рассмотрения, отзывы других клиентов и наличие лицензии. Наш сервис собрал только проверенные организации с лицензией ЦБ РФ.' },
                { q: 'Что делать, если отказали в займе?', a: 'Если вам отказали, попробуйте: 1) подать заявку в другую МФО, 2) уменьшить сумму займа, 3) проверить данные в заявке на ошибки, 4) улучшить кредитную историю. Также можно воспользоваться услугами залогового займа.' },
                { q: 'Как погасить займ без просрочек?', a: 'Для своевременного погашения: 1) настройте автоматический платеж, 2) вносите деньги за несколько дней до срока, 3) следите за графиком в личном кабинете, 4) при трудностях свяжитесь с МФО для реструктуризации.' },
                { q: 'Можно ли продлить займ?', a: 'Да, большинство МФО предоставляют услугу пролонгации (продления). Для этого нужно оплатить проценты за текущий период и оформить продление через личный кабинет или приложение.' },
              ].map((faq, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#667eea' }}>
                    ❓ {faq.q}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, pl: 2, borderLeft: '3px solid #667eea', py: 1 }}>
                    {faq.a}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Card>
        
        {/* CTA */}
        <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#fff', borderRadius: 3, border: '2px solid #667eea' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
            Нужна консультация?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            {data.content.conclusion || 'Наши специалисты помогут подобрать оптимальный вариант займа'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              href="/allmfo"
              sx={{ 
                bgcolor: '#667eea', 
                fontWeight: 700,
                px: 4,
                '&:hover': { bgcolor: '#5568d3' }
              }}
            >
              Подобрать займ
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              href="/faq"
              sx={{ 
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 700,
                px: 4,
                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
              }}
            >
              Читать FAQ
            </Button>
          </Box>
        </Box>
        
        {/* Полезные ссылки */}
        <Card sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Полезные статьи
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'Как выбрать МФО', href: '/articles' },
              { title: 'Что такое микрозайм', href: '/articles' },
              { title: 'Как погасить займ', href: '/articles' },
              { title: 'Права заемщика', href: '/articles' },
            ].map((link, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={i}>
                <Link href={link.href} style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#667eea', 
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    📖 {link.title}
                  </Typography>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>
    </Box>
  )
}
