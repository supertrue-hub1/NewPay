'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
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

export default function Footer() {
  const { footerData, isLoaded } = useFooterData()

  // Prevent hydration mismatch
  if (!isLoaded) {
    return <Box component="footer" sx={{ bgcolor: '#1a237e', color: 'white', py: 4, mt: 'auto', minHeight: 200 }} />
  }

  return (
    <Box component="footer" suppressHydrationWarning sx={{ bgcolor: '#1a237e', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Займы МФО
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              {footerData.about}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Контакты
            </Typography>
            {footerData.phone && (
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                📞 {footerData.phone}
              </Typography>
            )}
            {footerData.email && (
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                ✉️ {footerData.email}
              </Typography>
            )}
            {footerData.address && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                📍 {footerData.address}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Информация
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
                Пользовательское соглашение
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/about" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                О нас
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/sitemap" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Карта сайта
              </Typography>
              <Typography 
                variant="body2" 
                component={Link} 
                href="/map" 
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Карта присутствия МФО в России
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
            © 2026 NewPay.ru. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
