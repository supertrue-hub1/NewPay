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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Facebook, Twitter, Instagram, Telegram, Edit, InstallMobile } from '@mui/icons-material'
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

export default function Footer() {
  const { footerData, isLoaded } = useFooterData()

  if (!isLoaded) {
    return <Box component="footer" sx={{ bgcolor: '#1a237e', color: 'white', py: 4, mt: 'auto', minHeight: 200 }} />
  }

  return (
    <Box component="footer" suppressHydrationWarning sx={{ bgcolor: '#1a237e', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Zaymy MFO
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              {footerData.about}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Kontakty
            </Typography>
            {footerData.phone && (
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {footerData.phone}
              </Typography>
            )}
            {footerData.email && (
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {footerData.email}
              </Typography>
            )}
            {footerData.address && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {footerData.address}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Informatsiya
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/privacy" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                {footerData.privacyPolicy}
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/terms" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Polzovatelskoe soglashenie
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/about" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                O nas
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/sitemap" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Karta sayta
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/map" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Karta prisutstviya MFO v Rossii
              </Typography>
            </Box>

            {Object.values(footerData.socialLinks || {}).some(Boolean) && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {footerData.socialLinks?.facebook && (
                  <IconButton size="small" sx={{ color: 'white' }} href={footerData.socialLinks.facebook} target="_blank">
                    <Facebook />
                  </IconButton>
                )}
                {footerData.socialLinks?.twitter && (
                  <IconButton size="small" sx={{ color: 'white' }} href={footerData.socialLinks.twitter} target="_blank">
                    <Twitter />
                  </IconButton>
                )}
                {footerData.socialLinks?.instagram && (
                  <IconButton size="small" sx={{ color: 'white' }} href={footerData.socialLinks.instagram} target="_blank">
                    <Instagram />
                  </IconButton>
                )}
                {footerData.socialLinks?.telegram && (
                  <IconButton size="small" sx={{ color: 'white' }} href={footerData.socialLinks.telegram} target="_blank">
                    <Telegram />
                  </IconButton>
                )}
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            {footerData.cookieInfo}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            2026 NewPay.ru. Vse prava zashchishcheny.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

