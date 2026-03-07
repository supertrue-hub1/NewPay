'use client'

import { useState, useCallback, useMemo } from 'react'
import { Box, Dialog, IconButton, Typography, Button, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import StarIcon from '@mui/icons-material/Star'
import Link from 'next/link'

interface MfoOffer {
  id: string
  name: string
  logo?: string
  amount: string
  rate: string
  term: string
  approvalTime: string
  badge?: string
  link: string
}

interface ExitIntentPopupProps {
  mode?: 'static' | 'ai'
  bestOffer?: MfoOffer
  userContext?: {
    clientType: 'new' | 'returning'
    desiredAmount?: number
    desiredTerm?: number
    deviceType?: 'desktop' | 'mobile'
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  }
}

// Статические лучшие предложения
const STATIC_OFFERS: MfoOffer[] = [
  {
    id: '1',
    name: 'Екапуста',
    amount: 'до 30 000 ₽',
    rate: 'от 0%',
    term: 'до 21 дня',
    approvalTime: '3 минуты',
    badge: 'Для новых',
    link: '/mfo/ekapusta'
  },
  {
    id: '2',
    name: 'Займер',
    amount: 'до 30 000 ₽',
    rate: 'от 0%',
    term: 'до 30 дней',
    approvalTime: '2 минуты',
    badge: 'Без отказа',
    link: '/mfo/zaymer'
  },
  {
    id: '3',
    name: 'МигКредит',
    amount: 'до 25 000 ₽',
    rate: 'от 0%',
    term: 'до 21 дня',
    approvalTime: '3 минуты',
    badge: 'Первый 0%',
    link: '/mfo/migcredit'
  }
]

// База МФО для AI режима
const MFO_DATABASE = [
  { id: '1', name: 'Екапуста', minSum: 1000, maxSum: 30000, minTerm: 5, maxTerm: 21, rating: 4.8, firstFree: true, instant: true },
  { id: '2', name: 'Займер', minSum: 2000, maxSum: 30000, minTerm: 7, maxTerm: 30, rating: 4.7, firstFree: true, instant: true },
  { id: '3', name: 'МигКредит', minSum: 3000, maxSum: 25000, minTerm: 5, maxTerm: 21, rating: 4.6, firstFree: true, instant: true },
  { id: '4', name: 'Joy Money', minSum: 2000, maxSum: 20000, minTerm: 5, maxTerm: 15, rating: 4.5, firstFree: true, instant: true },
  { id: '5', name: 'Турбозайм', minSum: 3000, maxSum: 15000, minTerm: 7, maxTerm: 14, rating: 4.4, firstFree: false, instant: true },
]

// AI логика генерации оффера
function generateAIOffer(context: ExitIntentPopupProps['userContext']): MfoOffer {
  const { clientType = 'new', desiredAmount = 10000, desiredTerm = 14, timeOfDay = 'afternoon' } = context || {}
  
  // Фильтруем подходящие МФО
  let suitableMfo = MFO_DATABASE.filter(mfo => {
    const amountOk = desiredAmount >= mfo.minSum && desiredAmount <= mfo.maxSum
    const termOk = desiredTerm >= mfo.minTerm && desiredTerm <= mfo.maxTerm
    return amountOk && termOk
  })

  // Если нет точных совпадений, берём все для новых или с лучшим рейтингом
  if (suitableMfo.length === 0) {
    suitableMfo = clientType === 'new' 
      ? MFO_DATABASE.filter(mfo => mfo.firstFree)
      : MFO_DATABASE.sort((a, b) => b.rating - a.rating).slice(0, 3)
  }

  const bestMfo = suitableMfo[0]

  // Генерируем тексты
  const headlines: Record<string, string> = {
    new: 'Стоп! Не уходите — для вас есть спецпредложение!',
    returning: 'С возвращением! Вот ваш персональный займ'
  }

  const subheadlines: Record<string, string> = {
    morning: 'Начните день с денег — одобрение уже через 2 минуты',
    afternoon: 'Деньги нужны сейчас — оформим за 3 минуты',
    evening: 'Получите займ вечером — мы работаем 24/7',
    night: 'Ночь — не помеха! Одобрение за пару минут'
  }

  const urgencyReasons = [
    'Предложение действует сегодня',
    'Осталось 2 часа для одобрения',
    'Акция для новых клиентов',
    'Лимиты заканчиваются'
  ]

  const socialProofs = [
    `Рейтинг ${bestMfo.rating}/5, одобрение 98%`,
    `${bestMfo.rating} балла из 5 — доверяют тысячи`,
    '98% одобренных заявок'
  ]

  return {
    id: bestMfo.id,
    name: bestMfo.name,
    amount: `до ${bestMfo.maxSum.toLocaleString()} ₽`,
    rate: bestMfo.firstFree ? 'от 0%' : 'от 1%',
    term: `до ${bestMfo.maxTerm} дней`,
    approvalTime: '3 минуты',
    badge: clientType === 'new' ? 'Для новых' : 'Постоянным клиентам',
    link: `/mfo/${bestMfo.name.toLowerCase().replace(/\s/g, '-')}`,
    headline: headlines[clientType],
    subheadline: subheadlines[timeOfDay],
    urgencyReason: urgencyReasons[Math.floor(Math.random() * urgencyReasons.length)],
    socialProof: socialProofs[Math.floor(Math.random() * socialProofs.length)],
    personalBenefit: clientType === 'new' ? 'Первый займ без процентов!' : 'Специальная скидка для вас!'
  }
}

export default function ExitIntentPopup({ 
  mode = 'static', 
  bestOffer: initialOffer,
  userContext 
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  // Вычисляем оффер с useMemo
  const offer = useMemo(() => {
    if (initialOffer) return initialOffer
    if (mode === 'ai' && userContext) {
      return generateAIOffer(userContext)
    }
    return STATIC_OFFERS[0]
  }, [mode, userContext, initialOffer])

  // Отслеживание mouse leave (exit intent)
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (hasShown || isOpen) return
    
    const threshold = 10 // пикселей от верхней границы
    if (e.clientY <= threshold) {
      setIsOpen(true)
      setHasShown(true)
    }
  }, [hasShown, isOpen])

  // Отслеживание scroll (для мобильных)
  const handleScroll = useCallback(() => {
    if (hasShown || isOpen) return
    
    const scrollPosition = window.scrollY
    const pageHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    
    // Показываем если пользователь прокрутил более 70% страницы
    if (scrollPosition / (pageHeight - windowHeight) > 0.7) {
      setIsOpen(true)
      setHasShown(true)
    }
  }, [hasShown, isOpen])

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleMouseLeave, handleScroll])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!offer) return null

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
          bgcolor: 'transparent',
          boxShadow: 'none'
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)'
          }
        }
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.9)',
          '&:hover': { bgcolor: 'white' }
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Popup content */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Gradient header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            textAlign: 'center',
            color: 'white'
          }}
        >
          {/* Badge */}
          {offer.badge && (
            <Chip
              label={offer.badge}
              size="small"
              sx={{
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          )}
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            {offer.headline || 'Стоп! Не уходите — для вас есть спецпредложение!'}
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {offer.subheadline || 'Первый займ под 0% — одобрение за 3 минуты'}
          </Typography>
        </Box>

        {/* Main content */}
        <Box sx={{ p: 3 }}>
          {/* MFO Name and Amount */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 1 }}>
              {offer.name}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
              {offer.amount}
            </Typography>
          </Box>

          {/* Features grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Ставка
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#4caf50' }}>
                {offer.rate}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Срок
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {offer.term}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Одобрение
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {offer.approvalTime}
              </Typography>
            </Box>
          </Box>

          {/* Trust signals */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {offer.socialProof || 'Рейтинг 4.8/5'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUpIcon sx={{ color: '#4caf50', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                98% одобрения
              </Typography>
            </Box>
          </Box>

          {/* Urgency */}
          {offer.urgencyReason && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 3,
                p: 1.5,
                bgcolor: '#fff3e0',
                borderRadius: 2,
                border: '1px solid #ff9800'
              }}
            >
              <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 600 }}>
                {offer.urgencyReason}
              </Typography>
            </Box>
          )}

          {/* CTA Button */}
          <Link href={offer.link} style={{ textDecoration: 'none' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' },
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)'
              }}
            >
              Получить деньги
            </Button>
          </Link>

          {/* Personal benefit */}
          {offer.personalBenefit && (
            <Typography 
              variant="body2" 
              sx={{ textAlign: 'center', mt: 2, color: '#4caf50', fontWeight: 600 }}
            >
              ✨ {offer.personalBenefit}
            </Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
