'use client'

import { Container, Typography, Box, Slider, Card, CardContent, Grid, Chip, Button, Rating, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, CircularProgress } from '@mui/material'
import { MFO } from '@/data/mfo'
import { FAQ } from '@/data/faq'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Close, Info, Description, CheckCircle, AccessTime, Info as InfoIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'
import ReviewSection from '@/components/ReviewSection'
import { mfoData as staticMfoData } from '@/data/mfo-data'
import { faqData as staticFaqData } from '@/data/faq-data'

const STORAGE_KEY_MFO = 'mfo'
const STORAGE_KEY_FAQ = 'faq'

function Calculator() {
  const [sum, setSum] = useState(10000)
  const [term, setTerm] = useState(10)

  const totalAmount = useMemo(() => {
    return Math.round(sum * (0.008 * term) * 100) / 100
  }, [sum, term])

  const handleSumChange = useCallback((_: Event | React.SyntheticEvent, value: number | number[]) => {
    setSum(value as number)
  }, [])

  const handleTermChange = useCallback((_: Event | React.SyntheticEvent, value: number | number[]) => {
    setTerm(value as number)
  }, [])

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Калькулятор займа
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>Сумма: {sum.toLocaleString()} ₽</Typography>
        <Slider
          value={sum}
          onChange={handleSumChange}
          min={1000}
          max={30000}
          step={1000}
          marks={[
            { value: 1000, label: '1 000 ₽' },
            { value: 30000, label: '30 000 ₽' },
          ]}
          size="medium"
          sx={{
            '& .MuiSlider-markLabel': {
              transform: 'translateX(-50%)',
            },
            '& .MuiSlider-markLabel[data-index="0"]': {
              left: '3.33% !important',
            },
            '& .MuiSlider-markLabel[data-index="1"]': {
              left: '96.67% !important',
            },
          }}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>Срок: {term} дней</Typography>
        <Slider
          value={term}
          onChange={handleTermChange}
          min={5}
          max={30}
          marks={[
            { value: 5, label: '5 дн.' },
            { value: 30, label: '30 дн.' },
          ]}
          size="medium"
          sx={{
            '& .MuiSlider-markLabel': {
              transform: 'translateX(-50%)',
            },
            '& .MuiSlider-markLabel[data-index="0"]': {
              left: '3.33% !important',
            },
            '& .MuiSlider-markLabel[data-index="1"]': {
              left: '96.67% !important',
            },
          }}
        />
      </Box>
      <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700, mb: 2 }}>
        К возврату: {totalAmount.toLocaleString()} ₽
      </Typography>
      <Button 
        variant="contained" 
        fullWidth 
        size="large"
        href="/allmfo"
        sx={{ 
          bgcolor: '#4caf50', 
          '&:hover': { bgcolor: '#43a047' },
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600
        }}
      >
        Подобрать займ
      </Button>
    </Card>
  )
}

export default function HomeContent() {
  const [selectedMfo, setSelectedMfo] = useState<MFO | null>(null)
  const [tabValue, setTabValue] = useState<number>(0)
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [faqData, setFaqData] = useState<FAQ[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const t = useTranslations('HomePage')

  // Загрузка данных из БД/API
  const loadData = useCallback(async () => {
    if (typeof window === 'undefined') return
    
    // Загрузка МФО из API (база данных)
    try {
      const response = await fetch('/api/mfo')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const convertedData: MFO[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            logo: item.logo,
            rating: item.rating,
            reviews: item.reviews,
            sumMin: item.sum_min,
            sumMax: item.sum_max,
            termMin: item.term_min,
            termMax: item.term_max,
            percent: item.percent,
            firstFree: item.first_free,
            instant: item.instant,
            badge: item.badge,
            siteUrl: item.site_url,
            address: item.address,
            phone: item.phone,
            inn: item.inn,
            ogrn: item.ogrn,
            license: item.license,
            clicks: item.clicks || 0,
            conversions: item.conversions || 0,
          }))
          setMfoData(convertedData)
          setIsLoaded(true)
          return
        }
      }
    } catch (e) {
      console.log('API not available, trying localStorage')
    }
    
    // Если API недоступен - пробуем localStorage
    const storedMfo = localStorage.getItem(STORAGE_KEY_MFO)
    if (storedMfo) {
      try {
        const parsed = JSON.parse(storedMfo)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMfoData(parsed)
        } else {
          setMfoData(staticMfoData)
        }
      } catch (e) {
        console.error('Error parsing MFO data:', e)
        setMfoData(staticMfoData)
      }
    } else {
      setMfoData(staticMfoData)
    }

    // Загрузка FAQ
    const storedFaq = localStorage.getItem(STORAGE_KEY_FAQ)
    if (storedFaq) {
      try {
        const parsed = JSON.parse(storedFaq)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFaqData(parsed)
        } else {
          setFaqData(staticFaqData)
        }
      } catch (e) {
        console.error('Error parsing FAQ data:', e)
        setFaqData(staticFaqData)
      }
    } else {
      setFaqData(staticFaqData)
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadData()

    // Слушаем изменения localStorage
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_MFO || e.key === STORAGE_KEY_FAQ) {
        loadData()
      }
    }

    window.addEventListener('storage', handleStorage)
    
    // Также периодически проверяем localStorage (для той же вкладки)
    const interval = setInterval(loadData, 1000)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [loadData])

  const handleOpenMfo = useCallback((mfo: MFO) => {
    setSelectedMfo(mfo)
  }, [])

  const handleCloseMfo = useCallback(() => {
    setSelectedMfo(null)
  }, [])

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', 
        py: 10, 
        mb: 4,
        borderRadius: '0 0 50px 50px',
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ 
                display: 'inline-block', 
                bgcolor: 'rgba(255,255,255,0.15)', 
                borderRadius: 3, 
                px: 2, 
                py: 0.5, 
                mb: 2 
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  🔥 Лучшие предложения от проверенных МФО
                </Typography>
              </Box>
              <Typography variant="h2" component="h1" gutterBottom sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.2rem', md: '3.2rem' },
                lineHeight: 1.2,
                mb: 2
              }}>
                {t('title')}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontWeight: 400, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                {t('description')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Calculator />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Займы на карту без отказа — Мгновенный подбор лучших МФО
        </Typography>

        <Grid container spacing={2}>
          {mfoData.slice(0, 8).map((mfo) => (
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

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {mfo.firstFree && <Chip label="Первый займ 0%" color="primary" size="small" />}
                    {mfo.instant && <Chip label="Мгновенно" size="small" />}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenMfo(mfo)}
                      sx={{ minWidth: 50 }}
                    >
                      <Info />
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => window.open(mfo.siteUrl || '#', '_blank')}
                      sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                    >
                      Получить деньги
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            href="/allmfo"
            size="large"
            sx={{ 
              bgcolor: '#1a237e', 
              '&:hover': { bgcolor: '#0d1642' },
              px: 4,
              py: 1.5
            }}
          >
            Перейти ко всем предложениям
          </Button>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
            Как это работает
          </Typography>
          <Grid container spacing={3}>
            {[
              { step: '1', title: 'Выберите сумму и срок', desc: 'Используйте калькулятор для подбора оптимальных условий' },
              { step: '2', title: 'Заполните заявку', desc: 'Понадобятся только паспортные данные и номер карты' },
              { step: '3', title: 'Получите деньги', desc: 'Деньги поступят на карту в течение 5-15 минут' },
            ].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.step}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: '#1a237e',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    mx: 'auto',
                    mb: 2,
                  }}>
                    {item.step}
                  </Box>
                  <Typography variant="h6" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
            Часто задаваемые вопросы
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqData.map((faq) => (
              <Accordion key={faq.id} sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                <AccordionSummary
                  expandIcon={<span style={{ fontSize: '1.5rem' }}>▼</span>}
                  sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#fff' }}>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Секция отзывов */}
        <Box sx={{ mt: 8 }}>
          <ReviewSection />
        </Box>

        {/* Модальное окно с детальной информацией */}
        <Dialog 
          open={!!selectedMfo} 
          onClose={() => { setSelectedMfo(null); setTabValue(0); }}
          maxWidth="sm"
          fullWidth
          disableScrollLock
          slotProps={{
            backdrop: {
              sx: { bgcolor: 'rgba(0, 0, 0, 0.5)' }
            }
          }}
        >
          {selectedMfo && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Logo logo={selectedMfo.logo} size={50} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedMfo.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={selectedMfo.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({selectedMfo.reviews.toLocaleString()} отзывов)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => { setSelectedMfo(null); setTabValue(0); }}><Close /></IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(_: React.SyntheticEvent, v: number) => setTabValue(v)}
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    px: 2,
                    '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' },
                    '& .Mui-selected': { color: '#667eea' },
                    '& .MuiTabs-indicator': { bgcolor: '#667eea' },
                  }}
                >
                  <Tab icon={<Description sx={{ fontSize: 18 }} />} iconPosition="start" label="Условия" />
                  <Tab icon={<CheckCircle sx={{ fontSize: 18 }} />} iconPosition="start" label="Требования" />
                  <Tab icon={<AccessTime sx={{ fontSize: 18 }} />} iconPosition="start" label="Как получить" />
                  <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="О МФО" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {tabValue === 0 && (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Сумма</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedMfo.sumMin.toLocaleString()} - {selectedMfo.sumMax.toLocaleString()} ₽</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Срок</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedMfo.termMin}-{selectedMfo.termMax} дней</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Ставка</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>{selectedMfo.percent}% в день</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Вероятность одобрения</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Высокая</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {selectedMfo.firstFree && <Chip label="Первый займ 0%" color="primary" />}
                          {selectedMfo.instant && <Chip label="Мгновенно" />}
                          {selectedMfo.badge && <Chip label={selectedMfo.badge} color="success" />}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {tabValue === 1 && (
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>Требования к заёмщику:</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1">Возраст от 18 до 75 лет</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1">Гражданство РФ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1">Паспорт РФ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1">Постоянная регистрация</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1">Наличие банковской карты</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {tabValue === 2 && (
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>Как получить займ:</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Выберите сумму и срок</Typography>
                            <Typography variant="body2" color="text.secondary">Укажите нужную сумму на калькуляторе</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Заполните заявку</Typography>
                            <Typography variant="body2" color="text.secondary">Укажите паспортные данные и контакты</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#667eea', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Дождитесь одобрения</Typography>
                            <Typography variant="body2" color="text.secondary">Обычно занимает 1-5 минут</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#4caf50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>✓</Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>Получите деньги на карту</Typography>
                            <Typography variant="body2" color="text.secondary">Мгновенное зачисление</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {tabValue === 3 && (
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>О компании {selectedMfo.name}:</Typography>
                      {selectedMfo.infoModal ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}>
                          {selectedMfo.infoModal}
                        </Typography>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          <InfoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                          <Typography variant="body1">Информация о МФО пока не добавлена</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => { setSelectedMfo(null); setTabValue(0); }}>Закрыть</Button>
                <Button 
                  variant="contained" 
                  onClick={() => window.open(selectedMfo.siteUrl || '#', '_blank')}
                  sx={{ bgcolor: '#4caf50' }}
                >
                  Получить деньги
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  )
}
