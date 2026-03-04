'use client'

import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
  Rating, 
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Tabs,
  Tab
} from '@mui/material'
import { useState, useMemo, useCallback } from 'react'
import { 
  AccountBalanceWallet, 
  CalendarToday, 
  TrendingDown, 
  Speed, 
  AttachMoney,
  CheckCircle,
  WorkspacePremium,
  Close,
  Info,
  Verified,
  Schedule,
  CreditCard,
  Person
} from '@mui/icons-material'
import Logo from '@/components/Logo'
import { mfoData as staticMfoData } from '@/data/mfo-data'
import { MFO } from '@/types/mfo'

type SortType = 'overpayment' | 'amount' | 'speed'

interface MfoOffer extends MFO {
  totalRepayment: number
  overpayment: number
  isBest: boolean
}

export default function MfoComparePage() {
  const [amount, setAmount] = useState<number>(10000)
  const [term, setTerm] = useState<number>(10)
  const [sortType, setSortType] = useState<SortType>('overpayment')
  const [mfoData] = useState<MFO[]>(staticMfoData)
  const [selectedMfo, setSelectedMfo] = useState<MfoOffer | null>(null)
  const [tabValue, setTabValue] = useState<number>(0)

  const calculateRepayment = useCallback((mfo: MFO, loanAmount: number, days: number) => {
    if (mfo.sumMin > loanAmount || mfo.sumMax < loanAmount) {
      return null
    }
    if (mfo.termMin > days || mfo.termMax < days) {
      return null
    }

    const dailyRate = mfo.percent / 100
    const totalRepayment = Math.round(loanAmount + (loanAmount * dailyRate * days))
    const overpayment = totalRepayment - loanAmount

    return { totalRepayment, overpayment }
  }, [])

  const handleAmountChange = useCallback((_e: React.SyntheticEvent | Event, value: number | number[]) => {
    setAmount(value as number)
  }, [])

  const handleTermChange = useCallback((_e: React.SyntheticEvent | Event, value: number | number[]) => {
    setTerm(value as number)
  }, [])

  const mfoOffers = useMemo((): MfoOffer[] => {
    const calculated = mfoData
      .map(mfo => {
        const calc = calculateRepayment(mfo, amount, term)
        if (!calc) return null
        return {
          ...mfo,
          totalRepayment: calc.totalRepayment,
          overpayment: calc.overpayment,
          isBest: false
        }
      })
      .filter((mfo): mfo is MfoOffer => mfo !== null)

    let sorted: MfoOffer[] = []
    if (sortType === 'overpayment') {
      sorted = [...calculated].sort((a, b) => a.overpayment - b.overpayment)
    } else if (sortType === 'amount') {
      sorted = [...calculated].sort((a, b) => b.sumMax - a.sumMax)
    } else if (sortType === 'speed') {
      sorted = [...calculated].sort((a, b) => {
        if (a.instant && !b.instant) return -1
        if (!a.instant && b.instant) return 1
        return 0
      })
    }

    if (sorted.length > 0) {
      sorted[0].isBest = true
    }

    return sorted
  }, [mfoData, amount, term, sortType, calculateRepayment])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
  }

  const handleOpenModal = (mfo: MfoOffer) => {
    setSelectedMfo(mfo)
    setTabValue(0)
  }

  const handleCloseModal = () => {
    setSelectedMfo(null)
    setTabValue(0)
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Сравнение микрозаймов (МФО)
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Выберите сумму и срок, чтобы найти самый выгодный займ
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 20 } }}>
              <Card sx={{ 
                borderRadius: 3, 
                overflow: 'visible',
                boxShadow: '0 20px 60px rgba(26, 35, 126, 0.15)',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                    Калькулятор займа
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccountBalanceWallet sx={{ color: 'white', fontSize: 20, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                        Сумма займа
                      </Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      value={amount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                        if (val >= 1000 && val <= 100000) setAmount(val)
                      }}
                      InputProps={{
                        sx: { 
                          bgcolor: 'white', 
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: '1.5rem',
                          textAlign: 'center'
                        }
                      }}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                    
                    <Slider
                      value={amount}
                      onChange={handleAmountChange}
                      min={1000}
                      max={100000}
                      step={1000}
                      sx={{ 
                        mt: 2,
                        color: 'white',
                        '& .MuiSlider-thumb': { 
                          width: 24, 
                          height: 24, 
                          bgcolor: '#4caf50',
                          '&:hover': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0.2)' }
                        },
                        '& .MuiSlider-track': { height: 8, borderRadius: 4 },
                        '& .MuiSlider-rail': { height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
                        1 000 ₽
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
                        100 000 ₽
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday sx={{ color: 'white', fontSize: 20, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                        Срок займа (дней)
                      </Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      value={term}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                        if (val >= 1 && val <= 30) setTerm(val)
                      }}
                      InputProps={{
                        sx: { 
                          bgcolor: 'white', 
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: '1.5rem',
                          textAlign: 'center'
                        }
                      }}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                    
                    <Slider
                      value={term}
                      onChange={handleTermChange}
                      min={1}
                      max={30}
                      step={1}
                      sx={{ 
                        mt: 2,
                        color: 'white',
                        '& .MuiSlider-thumb': { 
                          width: 24, 
                          height: 24, 
                          bgcolor: '#4caf50',
                          '&:hover': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0.2)' }
                        },
                        '& .MuiSlider-track': { height: 8, borderRadius: 4 },
                        '& .MuiSlider-rail': { height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
                        1 день
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
                        30 дней
                      </Typography>
                    </Box>
                  </Box>

                  {mfoOffers.length > 0 && (
                    <Fade in>
                      <Paper sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 0.5 }}>
                          Примерная сумма к возврату:
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 800 }}>
                          {formatCurrency(mfoOffers[0]?.totalRepayment || 0)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                          Переплата: {formatCurrency(mfoOffers[0]?.overpayment || 0)}
                        </Typography>
                      </Paper>
                    </Fade>
                  )}

                  <Typography variant="body2" sx={{ mt: 2, color: 'white', opacity: 0.7, textAlign: 'center' }}>
                    Найдено предложений: {mfoOffers.length}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mt: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Сортировка:
                  </Typography>
                  <ToggleButtonGroup
                    value={sortType}
                    exclusive
                    onChange={(_, value) => value && setSortType(value)}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px !important',
                        py: 1,
                        fontWeight: 500,
                        textTransform: 'none',
                        '&.Mui-selected': {
                          bgcolor: '#1a237e',
                          color: 'white',
                          '&:hover': { bgcolor: '#283593' },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="overpayment">
                      <TrendingDown sx={{ mr: 0.5, fontSize: 18 }} />
                      Минимальная переплата
                    </ToggleButton>
                    <ToggleButton value="amount">
                      <AttachMoney sx={{ mr: 0.5, fontSize: 18 }} />
                      Максимальная сумма
                    </ToggleButton>
                    <ToggleButton value="speed">
                      <Speed sx={{ mr: 0.5, fontSize: 18 }} />
                      Быстрое одобрение
                    </ToggleButton>
                  </ToggleButtonGroup>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {mfoOffers.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  К сожалению, нет доступных предложений для указанных параметров
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Попробуйте изменить сумму или срок займа
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mfoOffers.map((mfo) => (
                  <Card 
                    key={mfo.id}
                    sx={{ 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: mfo.isBest ? '2px solid #4caf50' : '2px solid transparent',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    {mfo.isBest && (
                      <Chip 
                        icon={<WorkspacePremium sx={{ fontSize: 18 }} />}
                        label="Лучшее предложение"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -12, 
                          right: 16,
                          bgcolor: '#4caf50',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                          zIndex: 1
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 2.5 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Logo logo={mfo.logo} size={48} />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {mfo.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Rating value={mfo.rating} precision={0.1} size="small" readOnly />
                                <Typography variant="body2" color="text.secondary">
                                  {mfo.rating}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Ставка
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                            {mfo.percent}%<Typography component="span" variant="body2">/день</Typography>
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            К возврату
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                            {formatCurrency(mfo.totalRepayment)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f44336' }}>
                            +{formatCurrency(mfo.overpayment)}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => window.open(mfo.siteUrl || '#', '_blank')}
                              sx={{ 
                                bgcolor: mfo.isBest ? '#4caf50' : '#1a237e',
                                '&:hover': { bgcolor: mfo.isBest ? '#388e3c' : '#283593' },
                                fontWeight: 700,
                                py: 1.2,
                                borderRadius: 2
                              }}
                            >
                              Оформить
                            </Button>
                            
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenModal(mfo)}
                              startIcon={<Info />}
                              sx={{ 
                                borderColor: '#1a237e',
                                color: '#1a237e',
                                '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                py: 0.5
                              }}
                            >
                              Подробнее
                            </Button>

                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                              {mfo.firstFree && (
                                <Chip 
                                  label="Первый 0%" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }} 
                                />
                              )}
                              {mfo.instant && (
                                <Chip 
                                  icon={<Speed sx={{ fontSize: 14 }} />}
                                  label="Мгновенно" 
                                  size="small" 
                                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }} 
                                />
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ 
                        mt: 2, 
                        pt: 2, 
                        borderTop: '1px solid #eee',
                        display: { xs: 'none', sm: 'flex' },
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Сумма: {mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Срок: {mfo.termMin} - {mfo.termMax} дней
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Отзывы: {mfo.reviews.toLocaleString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            <Paper sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: '#e8eaf6' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Как выбрать МФО?
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#4caf50', mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Процентная ставка
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Обращайте внимание на суточную ставку
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#4caf50', mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Первый займ под 0%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Многие МФО предлагают первый займ бесплатно
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#4caf50', mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Скорость одобрения
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Мгновенное одобрение важно для срочных займов
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#4caf50', mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Отзывы и рейтинг
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Изучите отзывы других заёмщиков
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Модальное окно с информацией о МФО */}
      <Dialog 
        open={!!selectedMfo} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedMfo && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Logo logo={selectedMfo.logo} size={48} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedMfo.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={selectedMfo.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({selectedMfo.reviews.toLocaleString()} отзывов)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </DialogTitle>

            <Tabs 
              value={tabValue} 
              onChange={(_, v) => setTabValue(v)}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                px: 2,
                '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' },
                '& .Mui-selected': { color: '#1a237e' },
                '& .MuiTabs-indicator': { bgcolor: '#1a237e' },
              }}
            >
              <Tab icon={<CreditCard sx={{ fontSize: 18 }} />} iconPosition="start" label="Условия" />
              <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Требования" />
              <Tab icon={<Schedule sx={{ fontSize: 18 }} />} iconPosition="start" label="Как получить" />
            </Tabs>

            <DialogContent sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Сумма займа</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedMfo.sumMin.toLocaleString()} - {selectedMfo.sumMax.toLocaleString()} ₽
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Срок займа</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedMfo.termMin} - {selectedMfo.termMax} дней
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Ставка</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {selectedMfo.percent}% в день
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Вероятность одобрения</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Высокая</Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ваш расчёт:</Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Сумма к возврату</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                            {formatCurrency(selectedMfo.totalRepayment)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">Переплата</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#f44336' }}>
                            +{formatCurrency(selectedMfo.overpayment)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {selectedMfo.firstFree && (
                        <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Первый займ 0%" color="primary" />
                      )}
                      {selectedMfo.instant && (
                        <Chip icon={<Speed sx={{ fontSize: 16 }} />} label="Мгновенно" />
                      )}
                      {selectedMfo.badge && (
                        <Chip label={selectedMfo.badge} color="success" />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Требования к заёмщику:
                  </Typography>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body1">Мобильный телефон</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Как получить займ:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Выберите сумму и срок</Typography>
                        <Typography variant="body2" color="text.secondary">Укажите нужную сумму на калькуляторе</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Заполните заявку</Typography>
                        <Typography variant="body2" color="text.secondary">Укажите паспортные данные и контакты</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Дождитесь одобрения</Typography>
                        <Typography variant="body2" color="text.secondary">Обычно занимает 1-5 минут</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#4caf50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>✓</Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Получите деньги на карту</Typography>
                        <Typography variant="body2" color="text.secondary">Мгновенное зачисление</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={handleCloseModal}>Закрыть</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  window.open(selectedMfo.siteUrl || '#', '_blank')
                }}
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
              >
                Оформить займ
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
