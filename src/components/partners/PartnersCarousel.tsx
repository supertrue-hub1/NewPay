'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Box, Typography, IconButton, Grid } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Partner {
  id: number
  name: string
  slug?: string
  description?: string
  image_url?: string
  link?: string
  category?: string
  license?: string
  is_active?: boolean
  sort_order?: number
}

interface PartnersCarouselProps {
  title?: string
}

export default function PartnersCarousel({ title = 'Надёжные компании' }: PartnersCarouselProps) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(4)

  // Определение количества видимых карточек
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      if (width < 600) {
        setSlidesPerView(2)
      } else if (width < 900) {
        setSlidesPerView(3)
      } else if (width < 1200) {
        setSlidesPerView(4)
      } else {
        setSlidesPerView(5)
      }
    }

    updateSlidesPerView()
    window.addEventListener('resize', updateSlidesPerView)
    return () => window.removeEventListener('resize', updateSlidesPerView)
  }, [])

  // Загрузка данных
  const loadPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/partners')
      if (res.ok) {
        const data = await res.json()
        setPartners(data)
      }
    } catch (error) {
      console.error('Error loading partners:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    loadPartners()
  }, [loadPartners])

  // Скрыть блок если нет данных
  if (!isLoaded || partners.length === 0) {
    return null
  }

  const maxIndex = Math.max(0, partners.length - slidesPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  // Автоплей слайдера
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0
        }
        return prev + 1
      })
    }, 3000) // каждые 3 секунды

    return () => clearInterval(interval)
  }, [maxIndex])

  const visiblePartners = partners.slice(currentIndex, currentIndex + slidesPerView)

  return (
    <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 4, 
            textAlign: 'center',
            color: '#1a237e'
          }}
        >
          {title}
        </Typography>

        {/* Навигация и слайдер */}
        <Box 
          sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          role="region"
          aria-label="Слайдер: надёжные компании"
        >
          {/* Стрелка влево */}
          <IconButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Предыдущие компании"
            sx={{
              bgcolor: '#fff',
              boxShadow: 1,
              '&:hover': { bgcolor: '#f0f0f0' },
              '&:disabled': { bgcolor: '#e0e0e0', opacity: 0.5 },
              zIndex: 1,
              flexShrink: 0
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* Карточки */}
          <Grid 
            container 
            spacing={2}
            sx={{ 
              flex: 1,
              mx: 1
            }}
          >
            {visiblePartners.map((partner) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={partner.id}>
                <Box
                  component="a"
                  href={partner.link || '#'}
                  target={partner.link ? '_blank' : '_self'}
                  rel={partner.link ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!partner.link) {
                      e.preventDefault()
                    }
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    boxShadow: 1,
                    textDecoration: 'none !important',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    '&:hover *': {
                      textDecoration: 'none !important',
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      position: 'relative',
                      mb: 1.5,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      bgcolor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {partner.image_url ? (
                      <Image
                        src={partner.image_url}
                        alt={partner.name}
                        width={60}
                        height={60}
                        style={{ objectFit: 'contain' }}
                        unoptimized
                      />
                    ) : (
                      <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#666' }}>
                        {partner.name.charAt(0)}
                      </Typography>
                    )}
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      textAlign: 'center',
                      color: '#333',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {partner.name}
                  </Typography>
                  {partner.license && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666',
                        textAlign: 'center'
                      }}
                    >
                      {partner.license}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Стрелка вправо */}
          <IconButton
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Следующие компании"
            sx={{
              bgcolor: '#fff',
              boxShadow: 1,
              '&:hover': { bgcolor: '#f0f0f0' },
              '&:disabled': { bgcolor: '#e0e0e0', opacity: 0.5 },
              zIndex: 1,
              flexShrink: 0
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Точки-индикаторы */}
        {partners.length > slidesPerView && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 3,
              gap: 1
            }}
            role="tablist"
            aria-label="Навигация по слайдам"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                role="tab"
                aria-selected={currentIndex === index}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCurrentIndex(index)
                  }
                }}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: currentIndex === index ? '#1a237e' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: currentIndex === index ? '#1a237e' : '#999'
                  },
                  '&:focus': {
                    outline: '2px solid #1a237e',
                    outlineOffset: 2
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
