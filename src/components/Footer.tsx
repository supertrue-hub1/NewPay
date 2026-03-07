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
  about: 'Zaymy MFO - servis podbora luchshikh microzaymov ot proverkennykh finansovykh organizatsiy. My pomogaem poluchit dengi na kartu bystro i vygodno.',
  phone: '+7 (495) 123-45-67',
  email: 'info@zaim-mfo.ru',
  address: 'Moscow, ul. Primernaya, d. 1',
  privacyPolicy: 'Politika konfidentsialnosti',
  privacyContent: 'Nastoyashchaya Politika konfidentsialnosti opredelyaet poriadok obrabotki i zashchity personalnykh dannykh polzovateley servisa Zaim-MFO.ru.',
  offer: 'Oferta',
  cookieInfo: 'My ispolzuem cookie dlya uluchsheniya raboty sayta i analiza traffika.',
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
      sx={{ 
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gradient Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #303f9f 100%)'
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
                background: 'linear-gradient(135deg, #fff 0%, #90caf9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Zaymy MFO
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
                    <Phone sx={{ fontSize: 18, color: '#90caf9' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.phone}
                  </Typography>
                </Box>
              )}
              {footerData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.75, display: 'flex' }}>
                    <Email sx={{ fontSize: 18, color: '#90caf9' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {footerData.email}
                  </Typography>
                </Box>
              )}
              {footerData.address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.75, display: 'flex', mt: 0.25 }}>
                    <LocationOn sx={{ fontSize: 18, color: '#90caf9' }} />
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
              Produkty
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/mfo">Vse MFO</FooterLink>
              <FooterLink href="/allmfo">Sravnit</FooterLink>
              <FooterLink href="/zaim">Zaymy</FooterLink>
              <FooterLink href="/cards">Kreditnye karty</FooterLink>
              <FooterLink href="/promokody">Promokody</FooterLink>
            </Box>
          </Grid>

          {/* Information */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
              Informatsiya
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/about">O nas</FooterLink>
              <FooterLink href="/faq">Voprosy</FooterLink>
              <FooterLink href="/reviews">Otzyvy</FooterLink>
              <FooterLink href="/articles">Stati</FooterLink>
              <FooterLink href="/sitemap">Karta sayta</FooterLink>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
              Yuridicheskaya
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/privacy">Politika konfidentsialnosti</FooterLink>
              <FooterLink href="/terms">Polzovatelskoe soglashenie</FooterLink>
              <FooterLink href="/map">Karta MFO</FooterLink>
              <FooterLink href="/illegal-lenders">Cherny spisok</FooterLink>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white', fontSize: '1rem' }}>
              Rassylka
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Podpishites na novosti i luchshie predlozheniya
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Vash email"
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
                    '&.Mui-focused fieldset': { borderColor: '#90caf9' },
                    '& input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 }
                  }
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
                  '&:hover': { bgcolor: '#43a047' }
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </Button>
            </Box>
            {subscribed && (
              <Typography variant="body2" sx={{ color: '#81c784', fontSize: '0.8rem' }}>
                Spasibo za podpisku!
              </Typography>
            )}

            {/* Social Links */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                My v sotssetyakh
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
                  Bezopasnye platezhi
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <VerifiedUser sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  litsenziya CB RF
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: { xs: 'left', md: 'right' }, fontSize: '0.85rem' }}>
              {new Date().getFullYear()} Zaim-MFO.ru. Vse prava zashchishcheny.
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

