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
  IconButton
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
  VerifiedUser,
  WhatsApp
} from '@mui/icons-material'

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
    whatsapp?: string
  }
}

const defaultFooterData: FooterData = {
  about: 'CashPeek — сервис подбора лучших микрозаймов от проверенных финансовых организаций. Мы помогаем получить деньги на карту быстро и выгодно.',
  phone: '+7 (495) 123-45-67',
  email: 'info@cashpeek.ru',
  address: 'г. Москва, ул. Примерная, д. 1',
  privacyPolicy: 'Политика конфиденциальности',
  privacyContent: 'Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса CashPeek.',
  offer: 'Оферта',
  cookieInfo: 'Мы используем cookie для улучшения работы сайта и анализа трафика.',
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
          bgcolor: 'rgba(255,255,255,0.25)',
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

  if (!isLoaded) {
    return (
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#0a0f1c', 
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
      sx={{ 
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gradient Background - dark theme */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #0a0f1c 0%, #111827 50%, #0f172a 100%)'
        }}
      />

      {/* Decorative pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', py: 8 }}>
        <Grid container spacing={4}>
          {/* Logo & About */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: '1.5rem',
                color: 'white',
                letterSpacing: '-0.5px',
                textTransform: 'lowercase'
              }}
            >
              cashpeek
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

            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerData.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.75, display: 'flex' }}>
                    <Phone sx={{ fontSize: 18, color: '#10b981' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.phone}
                  </Typography>
                </Box>
              )}
              {footerData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.75, display: 'flex' }}>
                    <Email sx={{ fontSize: 18, color: '#10b981' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.email}
                  </Typography>
                </Box>
              )}
              {footerData.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.75, display: 'flex', mt: 0.25 }}>
                    <LocationOn sx={{ fontSize: 18, color: '#10b981' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.address}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Products */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
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

          {/* Information */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
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

          {/* Legal */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
              Юридическая
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/privacy">Политика конфиденциальности</FooterLink>
              <FooterLink href="/terms">Пользовательское соглашение</FooterLink>
              <FooterLink href="/map">Карта МФО</FooterLink>
              <FooterLink href="/illegal-lenders">Чёрный список</FooterLink>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
              Рассылка
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Подпишитесь на новости и лучшие предложения
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                    '& input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 }
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 1.5,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </Button>
            </Box>
            {subscribed && (
              <Typography variant="body2" sx={{ color: '#10b981', fontSize: '0.8rem' }}>
                Спасибо за подписку!
              </Typography>
            )}

            {/* Social Links */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                Мы в соцсетях
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SocialButton href={footerData.socialLinks?.facebook || '#'} icon={<Facebook sx={{ fontSize: 18 }} />} />
                <SocialButton href={footerData.socialLinks?.twitter || '#'} icon={<Twitter sx={{ fontSize: 18 }} />} />
                <SocialButton href={footerData.socialLinks?.instagram || '#'} icon={<Instagram sx={{ fontSize: 18 }} />} />
                <SocialButton href={footerData.socialLinks?.telegram || '#'} icon={<Telegram sx={{ fontSize: 18 }} />} />
                <SocialButton href={footerData.socialLinks?.whatsapp || '#'} icon={<WhatsApp sx={{ fontSize: 18 }} />} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ my: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }} />

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
                  лицензия ЦБ РФ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: { xs: 'left', md: 'right' }, fontSize: '0.85rem' }}>
              {new Date().getFullYear()} cashpeek.ru. Все права защищены.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'left', md: 'right' }, fontSize: '0.75rem', mt: 0.5 }}>
              {footerData.cookieInfo}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

