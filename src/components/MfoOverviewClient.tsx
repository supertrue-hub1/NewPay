'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Rating, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { 
  CheckCircle, 
  Cancel, 
  ExpandMore,
  Star,
  LocationOn,
  Phone,
  Language,
  Info as InfoIcon
} from '@mui/icons-material'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface MfoOverviewClientProps {
  mfo: {
    name: string
    logo: string
    rating: number
    reviews: number
    sumMin: number
    sumMax: number
    termMin: number
    termMax: number
    percent: number
    firstFree: boolean
    instant: boolean
    siteUrl?: string
    address?: string
    phone?: string
    inn?: string
    ogrn?: string
    license?: string
    pros?: string[]
    cons?: string[]
    risks?: string[]
    infoModal?: string
  }
}

export default function MfoOverviewClient({ mfo }: MfoOverviewClientProps) {
  const [isSticky, setIsSticky] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // FAQ data - in real app would come from DB
  const faqData = [
    {
      question: 'Как получить займ в МФО?',
      answer: 'Для получения займа необходимо заполнить заявку на сайте МФО, указав паспортные данные и реквизиты банковской карты. Решение принимается в течение нескольких минут, после чего деньги переводятся на карту.'
    },
    {
      question: 'Какие требования к заёмщику?',
      answer: 'Основные требования: возраст от 18 до 75 лет, гражданство РФ, постоянная регистрация, наличие действующего паспорта и банковской карты. Некоторые МФО также требуют наличие постоянного дохода.'
    },
    {
      question: 'Можно ли получить займ с плохой кредитной историей?',
      answer: 'Да, многие МФО выдают займы клиентам с плохой кредитной историей. Однако это может повлиять на условия займа — процентная ставка может быть выше, а сумма займа — меньше.'
    },
    {
      question: 'Как погасить займ?',
      answer: 'Погасить займ можно через личный кабинет на сайте МФО, через банковское приложение, в терминалах оплаты или в отделениях банков. Рекомендуется погашать заранее, чтобы избежать просрочки.'
    },
    {
      question: 'Что делать при просрочке?',
      answer: 'При возникновении просрочки необходимо как можно скорее связаться с МФО для урегулирования ситуации. Просрочка влечёт начисление штрафных процентов и негативно влияет на кредитную историю.'
    }
  ]

  // Sample reviews
  const reviews = [
    {
      name: 'Александр',
      rating: 5,
      text: 'Отличный сервис! Взял займ на 10 дней, всё прошло быстро и без проблем. Деньги пришли на карту мгновенно.',
      date: '15.01.2026'
    },
    {
      name: 'Мария',
      rating: 4,
      text: 'Хорошая компания, брала займ дважды. Единственное — немного высокая ставка, но это компенсируется скоростью.',
      date: '10.01.2026'
    },
    {
      name: 'Игорь',
      rating: 5,
      text: 'Всё отлично! Помогли, когда банки отказали. Первый займ вообще под 0%, очень доволен.',
      date: '05.01.2026'
    }
  ]

  return (
    <>
      {/* Sticky Action Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: isSticky ? 0 : -100,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          py: 2,
          px: 2,
          zIndex: 1000,
          transition: 'bottom 0.3s ease-in-out'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Logo logo={mfo.logo} size={40} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {mfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  От {mfo.percent}% в день
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              href={mfo.siteUrl || '#'}
              target="_blank"
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' },
                px: 4,
                whiteSpace: 'nowrap'
              }}
            >
              Перейти на сайт
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: isSticky ? 10 : 4 }}>
        {/* Hero Header */}
        <Box sx={{ mb: 4, pt: 2 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 2, 
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1.2
            }}
          >
            Обзор МФО {mfo.name}: Условия, Отзывы, Ставки
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
            Честный обзор {mfo.name} — все условия займов, реальные отзывы клиентов и рекомендации экспертов
          </Typography>
          
          {/* Quick Stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={mfo.rating} precision={0.1} size="small" readOnly />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.rating}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {mfo.reviews.toLocaleString()} отзывов
            </Typography>
            <Chip 
              label={`${mfo.percent}% в день`} 
              color="success" 
              size="small" 
            />
            {mfo.firstFree && (
              <Chip label="Первый займ 0%" color="primary" size="small" />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Information Block - About Company */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <InfoIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              О компании {mfo.name}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Logo logo={mfo.logo} size={100} />
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
                  {mfo.name}
                </Typography>
                {mfo.license && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    ✓ Лицензия ЦБ РФ
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                {mfo.infoModal || `МФО «${mfo.name}» — российская микрофинансовая организация, предоставляющая услуги онлайн-займов на карту. Компания работает на рынке микрозаймов и имеет официальную лицензию ЦБ РФ.`}
              </Typography>
              
              <Grid container spacing={2}>
                {mfo.address && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 20, color: '#666' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Адрес</Typography>
                        <Typography variant="body1">{mfo.address}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {mfo.phone && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Phone sx={{ fontSize: 20, color: '#666' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Телефон</Typography>
                        <Typography variant="body1">{mfo.phone}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {mfo.siteUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Language sx={{ fontSize: 20, color: '#666' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Сайт</Typography>
                        <Typography 
                          variant="body1" 
                          component="a" 
                          href={mfo.siteUrl}
                          target="_blank"
                          sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {mfo.siteUrl.replace('https://', '')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {mfo.inn && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">ИНН</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.inn}</Typography>
                  </Grid>
                )}
                {mfo.ogrn && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">ОГРН</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.ogrn}</Typography>
                  </Grid>
                )}
                {mfo.license && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Лицензия</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.license}</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Terms Table */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Условия займа
          </Typography>
          
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%', borderBottom: '1px solid #e0e0e0' }}>
                    Процентная ставка
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Chip 
                      label={`${mfo.percent}% в день`} 
                      color="success" 
                      size="small" 
                      sx={{ fontWeight: 600 }}
                    />
                    {mfo.firstFree && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Первый займ — 0%
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>
                    Сумма займа
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      от {mfo.sumMin.toLocaleString()} до {mfo.sumMax.toLocaleString()} ₽
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>
                    Срок займа
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      от {mfo.termMin} до {mfo.termMax} дней
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>
                    Способы получения
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Банковская карта" size="small" />
                      {mfo.instant && <Chip label="Мгновенно" color="primary" size="small" />}
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>
                    Способы погашения
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body1">
                      Банковская карта, банковский перевод, терминалы оплаты
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                    Штрафы при просрочке
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Typography variant="body1" color="error.main">
                      {mfo.risks?.[0] || 'Начисление пени 0,1% в день от суммы просрочки'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pros and Cons */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%', borderTop: '4px solid #4caf50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Преимущества
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {(mfo.pros || [
                  'Первый займ под 0% для новых клиентов',
                  'Мгновенное зачисление на карту',
                  'Высокий рейтинг и много отзывов',
                  'Автоматическое продление договора',
                  'Круглосуточная выдача'
                ]).map((pro, index) => (
                  <Typography 
                    component="li" 
                    key={index} 
                    sx={{ 
                      mb: 1.5, 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 1,
                      lineHeight: 1.5
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 18, color: '#4caf50', flexShrink: 0, mt: 0.2 }} />
                    {pro}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%', borderTop: '4px solid #f44336' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Cancel sx={{ color: '#f44336', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Недостатки
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {(mfo.cons || [
                  'Высокие проценты при просрочке',
                  'Требование к постоянной регистрации',
                  'Комиссия за вывод средств',
                  'Проверка через БКИ'
                ]).map((con, index) => (
                  <Typography 
                    component="li" 
                    key={index} 
                    sx={{ 
                      mb: 1.5, 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 1,
                      lineHeight: 1.5
                    }}
                  >
                    <Cancel sx={{ fontSize: 18, color: '#f44336', flexShrink: 0, mt: 0.2 }} />
                    {con}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Accordion */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Часто задаваемые вопросы
          </Typography>
          
          {faqData.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 1, 
                border: '1px solid #e0e0e0',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: '#f8f9fa',
                  borderRadius: '8px',
                  '&.Mui-expanded': { minHeight: 48 }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>

        {/* Reviews Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Star sx={{ color: '#ff9800', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Отзывы клиентов
            </Typography>
            <Chip 
              label={`${mfo.reviews.toLocaleString()}`} 
              size="small" 
              sx={{ ml: 'auto' }}
            />
          </Box>
          
          <Grid container spacing={3}>
            {reviews.map((review, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%', 
                    bgcolor: '#f8f9fa',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {review.name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                    "{review.text}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              href={`/reviews?mfo=${mfo.name}`}
            >
              Все отзывы о {mfo.name}
            </Button>
          </Box>
        </Paper>

        {/* CTA Button (non-sticky) */}
        <Paper sx={{ p: 3, bgcolor: '#e8f5e9', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Оформить займ в {mfo.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Высокая вероятность одобрения. Первый займ под 0%!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href={mfo.siteUrl || '#'}
            target="_blank"
            sx={{ 
              bgcolor: '#4caf50', 
              '&:hover': { bgcolor: '#388e3c' },
              px: 6,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Получить деньги
          </Button>
        </Paper>
      </Container>
    </>
  )
}
