'use client'

import { Container, Typography, Box, Grid, Card, CardContent, Button, Rating, Chip } from '@mui/material'
import { SEOPage } from '@/lib/seo-pages-generator'
import { mfoData } from '@/data/mfo-data'
import Logo from '@/components/Logo'

interface SEOContentProps {
  data: SEOPage
}

export default function SEOContent({ data }: SEOContentProps) {
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
        
        {/* Введение */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            Ищете <strong>{data.keywords[0]}</strong>? Мы подобрали для вас лучшие предложения от проверенных МФО.
            Оформите займ <strong>{data.keywords[1]}</strong> и получите деньги на банковскую карту уже через 5 минут.
            Без скрытых комиссий и сложных проверок. Высокий процент одобрения и удобные условия погашения.
          </Typography>
        </Card>
        
        {/* Фильтры МФО */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          ТОП МФО для оформления займа
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {mfoData.slice(0, 8).map((mfo) => (
            <Grid size={{ xs: 12, md: 6 }} key={mfo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.3s', 
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' },
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Logo logo={mfo.logo} size={40} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{mfo.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={mfo.rating} size="small" readOnly precision={0.1} />
                        <Typography variant="body2" color="text.secondary">
                          ({mfo.reviews.toLocaleString()})
                        </Typography>
                      </Box>
                    </Box>
                    {mfo.badge && (
                      <Chip label={mfo.badge} color="success" size="small" />
                    )}
                  </Box>
                  <Grid container spacing={2}>
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
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
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
        
        {/* Преимущества */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Почему выбирают нас
          </Typography>
          <Grid container spacing={2}>
            {[
              'Мгновенное одобрение за 1-5 минут',
              'Деньги на любую банковскую карту',
              'Без справок о доходах',
              'Рассмотрение 24/7',
              'Без проверки кредитной истории',
              'Первый займ под 0%',
              'Удобное погашение онлайн',
              'Скидки постоянным клиентам'
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                  <Typography sx={{ color: '#4caf50', fontWeight: 700 }}>✓</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* Как подать заявку */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Как оформить займ
          </Typography>
          <Grid container spacing={3}>
            {[
              { step: '1', title: 'Выберите сумму и срок', desc: 'Укажите нужную сумму и период погашения на калькуляторе' },
              { step: '2', title: 'Заполните заявку', desc: 'Понадобятся только паспортные данные и номер карты' },
              { step: '3', title: 'Дождитесь одобрения', desc: 'Решение придет через 1-5 минут на телефон и email' },
              { step: '4', title: 'Получите деньги', desc: 'Деньги мгновенно поступят на вашу банковскую карту' },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.step}>
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
                    fontSize: 20,
                    fontWeight: 700,
                    mx: 'auto',
                    mb: 2,
                  }}>
                    {item.step}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
        
        {/* Требования */}
        <Card sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Требования к заёмщику
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: '✓', text: 'Гражданство РФ' },
              { icon: '✓', text: 'Возраст от 18 до 75 лет' },
              { icon: '✓', text: 'Паспорт РФ' },
              { icon: '✓', text: 'Постоянная регистрация' },
              { icon: '✓', text: 'Банковская карта Visa/MasterCard' },
              { icon: '✓', text: 'Мобильный телефон' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
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
          {[
            { q: 'Кто может получить займ?', a: 'Граждане РФ в возрасте от 18 до 75 лет с постоянной регистрацией на территории России.' },
            { q: 'Какие документы нужны для оформления?', a: 'Для получения займа достаточно паспорта РФ. Большинство МФО не требуют справок о доходах.' },
            { q: 'Как быстро придут деньги?', a: 'После одобрения заявки деньги поступают на банковскую карту в течение 1-15 минут.' },
            { q: 'Можно ли продлить займ?', a: 'Да, большинство МФО предоставляют услугу пролонгации (продления) займа.' },
            { q: 'Как погасить займ?', a: 'Погасить займ можно через личный кабинет МФО, банковским переводом или через терминалы оплаты.' },
          ].map((faq, i) => (
            <Box key={i} sx={{ mb: 3, pb: i < 4 ? 3 : 0, borderBottom: i < 4 ? '1px solid #eee' : 'none' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{faq.q}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{faq.a}</Typography>
            </Box>
          ))}
        </Card>

        {/* CTA */}
        <Box sx={{ mt: 4, textAlign: 'center', p: 4, bgcolor: '#667eea', borderRadius: 3, color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Готовы оформить займ?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Выберите лучшее предложение выше и получите деньги на карту уже сегодня!
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
