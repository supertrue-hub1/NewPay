'use client'

import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button, Rating, Slider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Accordion, AccordionSummary, AccordionDetails, ToggleButtonGroup, ToggleButton, Tabs, Tab } from '@mui/material'
import Link from 'next/link'
import { MFO } from '@/data/mfo'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Close, Info, CalendarToday, AccountBalanceWallet, ExpandMore, TrendingUp, Star, Description, CheckCircle, AccessTime, Info as InfoIcon } from '@mui/icons-material'
import Logo from '@/components/Logo'
import { mfoData as staticMfoData } from '@/data/mfo-data'
import { loansInfoData, LoansInfoSection } from '@/data/loansInfo-data'

type SortType = 'popular' | 'rate'

interface AllMfoContentProps {
  pageTitle?: string
}

export default function AllMfoContent({ pageTitle }: AllMfoContentProps) {
  const [amount, setAmount] = useState<number>(10000)
  const [term, setTerm] = useState<number>(10)
  const [selectedMfo, setSelectedMfo] = useState<MFO | null>(null)
  const [sortType, setSortType] = useState<SortType>('popular')
  const [tabValue, setTabValue] = useState<number>(0)
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Загрузка данных из БД/API при монтировании
  useEffect(() => {
    const loadData = async () => {
      if (typeof window === 'undefined') return
      
      try {
        // Пробуем загрузить из API (база данных)
        const response = await fetch('/api/mfo')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            // Преобразуем данные из БД в формат MFO
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
        console.log('API not available, trying localStorage:', e)
      }
      
      // Если API недоступен - пробуем localStorage
      const storedMfo = localStorage.getItem('mfo')
      if (storedMfo) {
        try {
          const parsed = JSON.parse(storedMfo)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Дедупликация по уникальному ID
            const uniqueMfo = parsed.filter((item: any, index: number, self: any[]) => 
              index === self.findIndex((m: any) => m.id === item.id)
            )
            setMfoData(uniqueMfo)
            setIsLoaded(true)
            return
          }
        } catch (e) {
          console.error('Error parsing MFO data:', e)
        }
      }
      
      // Фоллбек на статические данные
      setMfoData(staticMfoData)
      setIsLoaded(true)
    }

    loadData()
  }, [])

  const returnDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + term)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }, [term])

  const returnAmount = Math.round(amount + (amount * 0.01 * term))

  const filteredMfo = useMemo(() => {
    let result = mfoData.filter(mfo => mfo.sumMin <= amount && mfo.sumMax >= amount)
    
    if (sortType === 'popular') {
      result = [...result].sort((a, b) => {
        const scoreA = a.rating * Math.log10(a.reviews + 1)
        const scoreB = b.rating * Math.log10(b.reviews + 1)
        return scoreB - scoreA
      })
    } else if (sortType === 'rate') {
      result = [...result].sort((a, b) => a.percent - b.percent)
    }
    
    return result
  }, [amount, sortType, mfoData])

  const handleAmountChange = useCallback((_e: React.SyntheticEvent | Event, value: number | number[]) => {
    setAmount(value as number)
  }, [])

  const handleTermChange = useCallback((_e: React.SyntheticEvent | Event, value: number | number[]) => {
    setTerm(value as number)
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
          {pageTitle || 'Все МФО'} — займы онлайн на карту без отказа
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          В нашем каталоге собраны все доступные кредиты наличными и онлайн-займы. Сравните условия выдачи, процентные ставки (от 0% для новых клиентов) и требования к заемщикам. Выберите лучшее финансовое предложение и получите деньги на карту или счет в день обращения.
        </Typography>

        {/* Калькулятор */}
        <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccountBalanceWallet sx={{ fontSize: 20, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Сумма</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {amount.toLocaleString()} ₽
                </Typography>
                <Slider
                  value={amount}
                  onChange={(_, v) => setAmount(v as number)}
                  min={1000}
                  max={30000}
                  step={500}
                  sx={{ 
                    color: 'white',
                    '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: 'white', '&:hover': { boxShadow: '0 0 0 8px rgba(255,255,255,0.16)' } },
                    '& .MuiSlider-track': { height: 6, borderRadius: 3 },
                    '& .MuiSlider-rail': { height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.3)' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>1 000 ₽</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>30 000 ₽</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarToday sx={{ fontSize: 20, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Срок (дней)</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {term} дней
                </Typography>
                <Slider
                  value={term}
                  onChange={(_, v) => setTerm(v as number)}
                  min={1}
                  max={30}
                  step={1}
                  sx={{ 
                    color: 'white',
                    '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: 'white', '&:hover': { boxShadow: '0 0 0 8px rgba(255,255,255,0.16)' } },
                    '& .MuiSlider-track': { height: 6, borderRadius: 3 },
                    '& .MuiSlider-rail': { height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.3)' },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>1 день</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>30 дней</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ color: 'white', textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Вернуть</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {returnAmount.toLocaleString()} ₽
                </Typography>
                <Box sx={{ 
                  display: 'inline-block', 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2, 
                  px: 2, 
                  py: 1,
                  backdropFilter: 'blur(10px)',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    📅 {returnDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (filteredMfo.length > 0 && filteredMfo[0].siteUrl) {
                        window.open(filteredMfo[0].siteUrl, '_blank')
                      } else if (mfoData.length > 0 && mfoData[0].siteUrl) {
                        window.open(mfoData[0].siteUrl, '_blank')
                      }
                    }}
                    disabled={filteredMfo.length === 0}
                    sx={{ 
                      width: 200,
                      bgcolor: '#4caf50',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#388e3c' },
                      '&:disabled': { bgcolor: '#ccc' }
                    }}
                  >
                    Получить деньги
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="body2" color="white" sx={{ mt: 3, textAlign: 'center', opacity: 0.8 }}>
            Показано: {filteredMfo.length} из {mfoData.length} предложений
          </Typography>
        </Card>
          
        {/* Сортировка */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Выберите займ
          </Typography>
          <ToggleButtonGroup
            value={sortType}
            exclusive
            onChange={(_, value) => value && setSortType(value)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '2px solid #e0e0e0',
                borderRadius: '20px !important',
                px: 2,
                py: 0.75,
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: '#667eea',
                  color: 'white',
                  borderColor: '#667eea',
                  '&:hover': { bgcolor: '#5a6fd6' },
                },
              },
            }}
          >
            <ToggleButton value="popular">
              <Star sx={{ mr: 0.5, fontSize: 18 }} />
              Популярные
            </ToggleButton>
            <ToggleButton value="rate">
              <TrendingUp sx={{ mr: 0.5, fontSize: 18 }} />
              По ставке
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Категории займов */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={1.5} sx={{ justifyContent: 'center' }}>
            {[
              { label: 'Все займы', href: '/allmfo' },
              { label: 'Займ онлайн', href: '/loans/zaim_online' },
              { label: 'Займ на карту', href: '/loans/zaim_na_kartu' },
              { label: 'Займ без отказа', href: '/loans/zaim_bez_otkaza' },
              { label: 'Займ по паспорту', href: '/loans/zaim_po_pasportu' },
              { label: 'Займ без процентов', href: '/loans/zaim_bez_procentov' },
              { label: 'Займ с просрочками', href: '/loans/zaim_s_prosrochkam' },
              { label: 'Займ до зарплаты', href: '/loans/zaim_do_zarplaty' },
              { label: 'Займ для студентов', href: '/loans/zaim_dlya_studentov' },
            ].map((item) => (
              <Grid size={{ xs: 'auto' }} key={item.href}>
                <Link href={item.href} passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      borderRadius: 3,
                      px: 2.5,
                      py: 1,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderColor: '#e0e0e0',
                      color: 'text.primary',
                      bgcolor: 'white',
                      '&:hover': {
                        bgcolor: '#667eea',
                        color: 'white',
                        borderColor: '#667eea',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {filteredMfo.map((mfo) => (
            <Grid size={{ xs: 6, md: 3 }} key={mfo.id}>
              <Card 
                sx={{ 
                  height: 280, 
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
                            ({mfo.reviews.toLocaleString()})
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {mfo.badge && <Chip label={mfo.badge} color="success" size="small" />}
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
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Высокая</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedMfo(mfo)}
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

        <Dialog open={!!selectedMfo} onClose={() => { setSelectedMfo(null); setTabValue(0); }} maxWidth="sm" fullWidth disableScrollLock>
          {selectedMfo && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Logo logo={selectedMfo.logo} size={50} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedMfo.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={selectedMfo.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">({selectedMfo.reviews.toLocaleString()})</Typography>
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
                  <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="О компании" />
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
                <Button variant="contained" onClick={() => window.open(selectedMfo.siteUrl || '#', '_blank')} sx={{ bgcolor: '#4caf50' }}>Получить деньги</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Таблица ТОП-10 МФО */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
            Где взять займ онлайн – ТОП-10 МФО 2026
          </Typography>
          
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>#</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>МФО</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>Сумма</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>Срок</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>Ставка</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>Рейтинг</TableCell>
                    <TableCell component="th" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 700 }}>Действие</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mfoData.slice(0, 10).map((mfo, index) => (
                    <TableRow key={mfo.id} sx={{ 
                      '&:nth-of-type(even)': { bgcolor: '#f8f9fa' },
                      '&:hover': { bgcolor: '#e3f2fd' },
                      transition: 'background-color 0.2s'
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a237e' }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Logo logo={mfo.logo} size={40} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {mfo.firstFree && <Chip label="0%" size="small" color="primary" sx={{ height: 18, fontSize: '0.7rem' }} />}
                              {mfo.instant && <Chip label="Мгновенно" size="small" sx={{ height: 18, fontSize: '0.7rem' }} />}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {mfo.termMin}-{mfo.termMax} дней
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${mfo.percent}%`} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#e8f5e9', 
                            color: '#2e7d32',
                            fontWeight: 700 
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={mfo.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            ({mfo.reviews})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => window.open(mfo.siteUrl || '#', '_blank')}
                          sx={{ 
                            bgcolor: '#4caf50', 
                            '&:hover': { bgcolor: '#388e3c' },
                            fontSize: '0.8rem',
                            py: 0.5
                          }}
                        >
                          Получить деньги
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Информация о займах */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
            {loansInfoData.title}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', mb: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}>
              {loansInfoData.content}
            </Typography>
          </Paper>

          {loansInfoData.sections.map((section, index) => (
            <Accordion key={index} elevation={0} sx={{ borderRadius: '8px !important', mb: 1, border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: 'white', borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#f8f9fa' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}>
                  {section.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
