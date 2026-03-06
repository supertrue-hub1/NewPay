'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Divider
} from '@mui/material'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Telegram,
  Email,
  Phone,
  LocationOn,
  Send,
  Security,
  VerifiedUser
} from '@mui/icons-material'
import InstallPrompt from './InstallPrompt'

export interface FooterData {
  about: string
  phone: string
  email: string
  address: string
  privacyPolicy: string
  privacyContent: string
  offer: string
  cookieInfo: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    telegram?: string
  }
}

const defaultFooterData: FooterData = {
  about: 'Займы МФО — сервис подбора лучших микрозаймов от проверенных финансовых организаций. Мы помогаем получить деньги на карту быстро и выгодно.',
  phone: '+7 (495) 123-45-67',
  email: 'info@zaim-mfo.ru',
  address: 'г. Москва, ул. Примерная, д. 1',
  privacyPolicy: 'Политика конфиденциальности',
  privacyContent: 'Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса Zaim-MFO.ru.\n\nМы собираем только необходимую информацию для оказания услуг: ФИО, контактные данные, паспортные данные для проверки кредитной истории. Все данные хранятся в зашифрованном виде и не передаются третьим лицам без вашего согласия.\n\nИспользование сервиса означает согласие с настоящей политикой конфиденциальности.',
  offer: 'Оферта',
  cookieInfo: 'Мы используем файлы cookie для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с использованием cookies.',
  socialLinks: {}
}

export const useFooterData = () => {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('footerData')
    if (stored) {
      setFooterData(JSON.parse(stored))
    } else {
      localStorage.setItem('footerData', JSON.stringify(defaultFooterData))
    }
    setIsLoaded(true)
  }, [])

  const saveFooterData = (data: FooterData) => {
    localStorage.setItem('footerData', JSON.stringify(data))
    setFooterData(data)
  }

  const updateFooterData = (data: Partial<FooterData>) => {
    saveFooterData({ ...footerData, ...data })
  }

  const resetFooterData = () => {
    saveFooterData(defaultFooterData)
  }

  return { footerData, updateFooterData, resetFooterData, isLoaded }
}

// Footer link component
interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        color: 'rgba(255,255,255,0.7)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        display: 'block',
        mb: 1,
        '&:hover': {
          color: '#fff',
          transform: 'translateX(5px)'
        }
      }}
    >
      {children}
    </Typography>
  )
}

// Social button component
interface SocialButtonProps {
  href: string
  icon: React.ReactNode
}

function SocialButton({ href, icon }: SocialButtonProps) {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        bgcolor: 'rgba(255,255,255,0.1)',
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-3px)'
        }
      }}
    >
      {icon}
    </IconButton>
  )
}

export default function Footer() {
  const { footerData, isLoaded } = useFooterData()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setSubscribed(false)
      }, 3000)
    }
  }

  // Prevent hydration mismatch
  if (!isLoaded) {
    return (
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#1a237e', 
          color: 'white', 
          py: 8, 
          mt: 'auto', 
          minHeight: 300 
        }} 
      />
    )
  }

  return (
    <Box 
      component="footer" 
      suppressHydrationWarning 
      sx={{ 
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background with gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #303f9f 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', py: 8 }}>
        <Grid container spacing={4}>
          {/* Logo and About Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #fff 0%, #90caf9 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Займы МФО
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  lineHeight: 1.8,
                  mb: 3
                }}
              >
                {footerData.about}
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerData.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    p: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Phone sx={{ fontSize: 18, color: '#90caf9' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.phone}
                  </Typography>
                </Box>
              )}
              {footerData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    p: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Email sx={{ fontSize: 18, color: '#90caf9' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.email}
                  </Typography>
                </Box>
              )}
              {footerData.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    p: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.25
                  }}>
                    <LocationOn sx={{ fontSize: 18, color: '#90caf9' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.address}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Products Column */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2.5,
                color: 'white',
                fontSize: '1rem'
              }}
            >
              Продукты
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/mfo">Все МФО</FooterLink>
              <FooterLink href="/allmfo">Сравнить</FooterLink>
              <FooterLink href="/zaim">Займы</FooterLink>
              <FooterLink href="/cards">Кредитные карты</FooterLink>
              <FooterLink href="/promokody">Промокоды</FooterLink>
            </Box>
          </Grid>

          {/* Information Column */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2.5,
                color: 'white',
                fontSize: '1rem'
              }}
            >
              Информация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/about">О нас</FooterLink>
              <FooterLink href="/faq">Вопросы</FooterLink>
              <FooterLink href="/reviews">Отзывы</FooterLink>
              <FooterLink href="/articles">Статьи</FooterLink>
              <FooterLink href="/sitemap">Карта сайта</FooterLink>
            </Box>
          </Grid>

          {/* Legal Column */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2.5,
                color: 'white',
                fontSize: '1rem'
              }}
            >
              Юридическая
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/privacy">Политика конфиденциальности</FooterLink>
              <FooterLink href="/terms">Пользовательское соглашение</FooterLink>
              <FooterLink href="/map">Карта присутствия МФО</FooterLink>
              <FooterLink href="/illegal-lenders">Чёрный список</FooterLink>
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2.5,
                color: 'white',
                fontSize: '1rem'
              }}
            >
              Рассылка
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Подпишитесь на новости и лучшие предложения
            </Typography>
            <Box 
              component="form" 
              onSubmit={handleSubscribe}
              sx={{ 
                display: 'flex', 
                gap: 1,
                mb: 2
              }}
            >
              <TextField
                size="small"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#90caf9',
                    },
                    '& input::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#4caf50',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 1.5,
                  '&:hover': {
                    bgcolor: '#43a047',
                  }
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </Button>
            </Box>
            {subscribed && (
              <Typography variant="body2" sx={{ color: '#81c784', fontSize: '0.8rem' }}>
                ✓ Спасибо за подписку!
              </Typography>
            )}

            {/* Social Links */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                Мы в соцсетях
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(footerData.socialLinks?.facebook || true) && (
                  <SocialButton href={footerData.socialLinks?.facebook || '#'} icon={<Facebook sx={{ fontSize: 18 }} />} />
                )}
                {(footerData.socialLinks?.twitter || true) && (
                  <SocialButton href={footerData.socialLinks?.twitter || '#'} icon={<Twitter sx={{ fontSize: 18 }} />} />
                )}
                {(footerData.socialLinks?.instagram || true) && (
                  <SocialButton href={footerData.socialLinks?.instagram || '#'} icon={<Instagram sx={{ fontSize: 18 }} />} />
                )}
                {(footerData.socialLinks?.telegram || true) && (
                  <SocialButton href={footerData.socialLinks?.telegram || '#'} icon={<Telegram sx={{ fontSize: 18 }} />} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Section */}
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Security sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Безопасные платежи
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <VerifiedUser sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Лицензия ЦБ РФ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                textAlign: { xs: 'left', md: 'right' },
                fontSize: '0.85rem'
              }}
            >
              © {new Date().getFullYear()} Zaim-MFO.ru. Все права защищены.
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)', 
                textAlign: { xs: 'left', md: 'right' },
                fontSize: '0.75rem',
                mt: 0.5
              }}
            >
              {footerData.cookieInfo}
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Install Prompt */}
      <InstallPrompt />
    </Box>
  )
}

