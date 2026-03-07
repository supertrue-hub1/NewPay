'use client'

import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button, Rating, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, CircularProgress } from '@mui/material'
import { MFO } from '@/data/mfo'
import { FAQ } from '@/data/faq'
import { useState, useCallback, useEffect } from 'react'
import { Close, Info, Description, CheckCircle, AccessTime, Info as InfoIcon, Menu, KeyboardArrowDown } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'
import ReviewSection from '@/components/ReviewSection'
import PartnersCarousel from '@/components/partners/PartnersCarousel'
import { mfoData as staticMfoData } from '@/data/mfo-data'
import { faqData as staticFaqData } from '@/data/faq-data'
import Link from 'next/link'

const STORAGE_KEY_MFO = 'mfo'
const STORAGE_KEY_FAQ = 'faq'

// Навигационное меню
const navItems = [
  { label: 'Главная', href: '/' },
  { 
    label: 'Займы', 
    href: '/allmfo',
    subitems: [
      { label: 'Все займы', href: '/allmfo' },
      { label: 'Сравнить займы', href: '/mfo' },
      { label: 'Займы онлайн', href: '/zajmy-online' },
      { label: 'Займы по городам', href: '/zajmy-online/moskva' },
    ]
  },
  { label: 'Кредитные карты', href: '/cards' },
  { label: 'Статьи', href: '/articles' },
  { label: 'FAQ', href: '/faq' },
  { 
    label: 'Ещё', 
    href: '#',
    subitems: [
      { label: 'Отзывы', href: '/reviews' },
      { label: 'Жалоба в ЦБ РФ', href: '/complaint-cb' },
      { label: 'Нелегальные кредиторы', href: '/illegal-lenders' },
    ]
  },
]

function ModernHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (href: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setHoveredItem(href)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null)
    }, 150)
    setDropdownTimeout(timeout)
  }

  return (
    <>
      {/* Desktop Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Logo */}
          <Box sx={{ position: 'absolute', left: 24 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/header.svg" alt="NewPay" style={{ height: 100 }} />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: '70px' }}>
            {navItems.map((item) => (
              <Box 
                key={item.href}
                sx={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              >
                <Box
                  component={Link}
                  href={item.href}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 1,
                    color: '#374151',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.08)',
                      color: '#4f46e5',
                    },
                  }}
                >
                  {item.label}
                  {item.subitems && <KeyboardArrowDown sx={{ fontSize: 18, opacity: 0.6 }} />}
                </Box>
                
                {item.subitems && hoveredItem === item.href && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      mt: 1,
                      bgcolor: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      py: 1,
                      px: 1,
                      minWidth: 180,
                      zIndex: 1300,
                    }}
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.subitems.map((subitem) => (
                      <Box
                        key={subitem.href}
                        component={Link}
                        href={subitem.href}
                        sx={{
                          display: 'block',
                          px: 2,
                          py: 1.5,
                          color: '#4b5563',
                          textDecoration: 'none',
                          fontSize: 14,
                          borderRadius: '10px',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            bgcolor: '#f3f4f6',
                            color: '#1f2937',
                          },
                        }}
                      >
                        {subitem.label}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Mobile Hamburger */}
          <Box sx={{ position: 'absolute', right: 24, display: { xs: 'block', md: 'none' } }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ bgcolor: 'rgba(99, 102, 241, 0.06)', borderRadius: '12px' }}>
              <Menu sx={{ fontSize: 24, color: '#374151' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: '#fff',
            zIndex: 1300,
            p: 3,
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setMobileOpen(false)}>
              <img src="/header.svg" alt="NewPay" style={{ height: 50 }} />
            </Link>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#374151' }}>
              <Close />
            </IconButton>
          </Box>

<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {navItems.map((item) => (
              <Box
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f3f4f6',
                    color: '#1a237e',
                  },
                }}
              >
                {item.label}
                {item.subitems && <KeyboardArrowDown sx={{ fontSize: 18, opacity: 0.6, transform: 'rotate(-90deg)' }} />}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}



export default function HomeContent() {
  const [selectedMfo, setSelectedMfo] = useState<MFO | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [faqData, setFaqData] = useState<FAQ[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const t = useTranslations('HomePage')

  // Загрузка данных из БД/API
  const loadData = useCallback(async () => {
    if (typeof window === 'undefined') return

    let mfoLoaded = false
    let faqLoaded = false

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
            infoModal: item.info_modal,
            seoDescription: item.seo_description,
            clicks: item.clicks || 0,
            conversions: item.conversions || 0,
          }))
          setMfoData(convertedData)
          mfoLoaded = true
        }
      }
    } catch (e) {
      console.log('API MFO not available')
    }

    // Если API не загрузил - используем localStorage или статические данные
    if (!mfoLoaded) {
      const storedMfo = localStorage.getItem(STORAGE_KEY_MFO)
      if (storedMfo) {
        try {
          const parsed = JSON.parse(storedMfo)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const uniqueMfo = parsed.filter((item: MFO, index: number, self: MFO[]) => 
              index === self.findIndex((m: MFO) => m.id === item.id)
            )
            setMfoData(uniqueMfo)
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
    }

    // Загрузка FAQ из API
    try {
      const response = await fetch('/api/faq')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setFaqData(data)
          faqLoaded = true
        }
      }
    } catch (e) {
      console.log('API FAQ not available')
    }

    // Если API не загрузил FAQ - используем localStorage или статические данные
    if (!faqLoaded) {
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
 <>
<Box sx={{ minHeight: '100vh', py: 4 }}>
 <Container maxWidth="lg">
      {/* Hero секция */}
      <Box
        sx={{
          mb: 6,
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Левая колонка - контент */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                {/* Бейдж с огнём */}
                <Box
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    bgcolor: '#f97316',
                    borderRadius: '50px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    mb: 3,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-5px)' },
                    },
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔥</span>
                  Лучшие предложения
                </Box>

                {/* Заголовок */}
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    color: '#111827',
                  }}
                >
                  Лучшие предложения от{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    проверенных МФО
                  </Box>
                </Typography>

                {/* Подзаголовок */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#4b5563',
                    mb: 3,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  Мгновенный подбор лучших займов с{' '}
                  <Box component="span" sx={{ color: '#0ea5e9', fontWeight: 600 }}>99% одобрения</Box>
                  {' '}и переводом на любую карту за 2 минуты
                </Typography>

                {/* Пиллы с преимуществами - кнопки */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', lg: 'flex-start' }, mb: 4 }}>
                  {[
                    { icon: '⚡', text: 'За 2 минуты', href: '/allmfo' },
                    { icon: '✅', text: 'Без отказа', href: '/loans/zaim_bez_otkaza' },
                    { icon: '💳', text: 'На любую карту', href: '/loans/zaim_na_kartu' },
                    { icon: '🎯', text: 'Одобрено 98%', href: '/allmfo' },
                  ].map((item, idx) => (
                    <Button
                      key={idx}
                      component={Link}
                      href={item.href}
                      variant="outlined"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 2.5,
                        py: 1,
                        bgcolor: 'white',
                        borderRadius: '50px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151',
                        borderColor: '#e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#f0fdf4',
                          borderColor: '#10b981',
                          color: '#10b981',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                        },
                      }}
                    >
                      <span>{item.icon}</span>
                      {item.text}
                    </Button>
                  ))}
                </Box>

                {/* CTA кнопки */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', lg: 'flex-start' }, mb: 5, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    href="/mfo"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 16,
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 12px 35px rgba(16, 185, 129, 0.45)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <span style={{ marginRight: 8 }}>⭐</span>
                    Найти лучший займ
                    <span style={{ marginLeft: 8 }}>→</span>
                  </Button>
                  <Button
                    variant="outlined"
                    href="/allmfo"
                    sx={{
                      borderColor: '#0ea5e9',
                      color: '#0ea5e9',
                      fontWeight: 600,
                      fontSize: 16,
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(14, 165, 233, 0.08)',
                        borderColor: '#0284c7',
                      },
                    }}
                  >
                    Сравнить все МФО
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Правая колонка - карточки МФО */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ position: 'relative', height: { xs: 280, md: 350 }, display: { xs: 'none', lg: 'block' } }}>
                {/* Главная карточка */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-2deg)',
                    width: 280,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    p: 2.5,
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translate(-50%, -55%) rotate(0deg) scale(1.02)',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0ea5e9', fontSize: 18 }}>
                      МК
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: '#111827' }}>МигКредит</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ color: '#f59e0b' }}>⭐</span>
                        <Typography sx={{ fontSize: 14, color: '#4b5563' }}>4.8 (2.3k)</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: '#dcfce7', color: '#16a34a', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 600 }}>
                      98%
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Сумма</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#111827' }}>до 100 000 ₽</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Ставка</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#10b981' }}>от 0%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ bgcolor: '#f0f9ff', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <span>🎯</span>
                    <Typography sx={{ fontSize: 13, color: '#0284c7', fontWeight: 500 }}>Одобрение за 2 минуты</Typography>
                  </Box>
                </Box>

                {/* Вторая карточка */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '5%',
                    transform: 'rotate(5deg)',
                    width: 240,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                    p: 2,
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotate(2deg) scale(1.02)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#f59e0b', fontSize: 14 }}>
                      ЕЗ
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>Езайм</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ color: '#f59e0b', fontSize: 12 }}>⭐</span>
                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>4.6</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#374151', mb: 1 }}>до 30 000 ₽</Typography>
                  <Typography sx={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Первый займ 0%</Typography>
                </Box>

                {/* Третья карточка */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '0%',
                    transform: 'rotate(-4deg)',
                    width: 230,
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                    p: 2,
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotate(-1deg) scale(1.02)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3b82f6', fontSize: 14 }}>
                      ЗМ
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>Займер</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ color: '#f59e0b', fontSize: 12 }}>⭐</span>
                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>4.7</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#374151', mb: 1 }}>до 50 000 ₽</Typography>
                  <Typography sx={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Мгновенно</Typography>
                </Box>
              </Box>

              {/* Мобильная версия - упрощённая */}
              <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', gap: 2, py: 2 }}>
                {['МигКредит', 'Езайм', 'Займер'].map((name, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      p: 2,
                      minWidth: 140,
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>{name}</Box>
                    <Box sx={{ color: '#10b981', fontWeight: 600, fontSize: 14 }}>до {idx === 0 ? '100к' : idx === 1 ? '30к' : '50к'} ₽</Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

        {/* Карточки МФО */}
        {!isLoaded ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
        <Grid container spacing={3}>
          {mfoData.slice(0, 8).map((mfo) => (
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
                        {mfo.sumMin ? mfo.sumMin.toLocaleString() : '—'} - {mfo.sumMax ? mfo.sumMax.toLocaleString() : '—'} ₽
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Срок</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mfo.termMin || '—'}-{mfo.termMax || '—'} дней
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Ставка</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {mfo.percent || '—'}% в день
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
        )}

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

        {/* Блок "Надёжные компании" */}
        <Box sx={{ mt: 8 }}>
          <PartnersCarousel />
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
                      <Rating value={selectedMfo.rating || 0} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({selectedMfo.reviews ? selectedMfo.reviews.toLocaleString() : 0} отзывов)
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
                  <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="О компании" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {tabValue === 0 && (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Сумма</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedMfo.sumMin ? selectedMfo.sumMin.toLocaleString() : '—'} - {selectedMfo.sumMax ? selectedMfo.sumMax.toLocaleString() : '—'} ₽</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Срок</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedMfo.termMin || '—'}-{selectedMfo.termMax || '—'} дней</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">Ставка</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>{selectedMfo.percent || '—'}% в день</Typography>
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
                      
                      {/* Описание компании */}
                      {selectedMfo.infoModal && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}>
                            {selectedMfo.infoModal}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Реквизиты компании */}
                      {(selectedMfo.inn || selectedMfo.ogrn || selectedMfo.license || selectedMfo.address || selectedMfo.phone) && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#1a237e' }}>
                            Реквизиты компании:
                          </Typography>
                          <Grid container spacing={1.5}>
                            {selectedMfo.inn && (
                              <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>ИНН:</Typography>
                                  <Typography variant="body2">{selectedMfo.inn}</Typography>
                                </Box>
                              </Grid>
                            )}
                            {selectedMfo.ogrn && (
                              <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>ОГРН:</Typography>
                                  <Typography variant="body2">{selectedMfo.ogrn}</Typography>
                                </Box>
                              </Grid>
                            )}
                            {selectedMfo.license && (
                              <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>Лицензия:</Typography>
                                  <Typography variant="body2">{selectedMfo.license}</Typography>
                                </Box>
                              </Grid>
                            )}
                            {selectedMfo.address && (
                              <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>Адрес:</Typography>
                                  <Typography variant="body2">{selectedMfo.address}</Typography>
                                </Box>
                              </Grid>
                            )}
                            {selectedMfo.phone && (
                              <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>Телефон:</Typography>
                                  <Typography variant="body2">{selectedMfo.phone}</Typography>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      )}
                      
                      {!selectedMfo.infoModal && !selectedMfo.inn && !selectedMfo.ogrn && !selectedMfo.license && !selectedMfo.address && !selectedMfo.phone && (
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
    </>
  )
}
