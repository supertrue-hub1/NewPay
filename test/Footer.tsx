'use client';

import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VkIcon from '@mui/icons-material/Share';

const FOOTER_LINKS = {
  main: [
    { label: 'Займы', href: '/loans' },
    { label: 'МФО', href: '/mfo' },
    { label: 'Рейтинг', href: '/rating' },
    { label: 'Акции', href: '/promotions' },
  ],
  info: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Блог', href: '/blog' },
    { label: 'Контакты', href: '/contacts' },
    { label: 'О нас', href: '/about' },
  ],
  legal: [
    { label: 'Политика конфиденциальности', href: '/privacy' },
    { label: 'Пользовательское соглашение', href: '/terms' },
    { label: 'Отказ от ответственности', href: '/disclaimer' },
  ],
};

const SOCIAL_LINKS = [
  { icon: <TelegramIcon sx={{ fontSize: 20 }} />, href: 'https://t.me/zaimgo', label: 'Telegram' },
  { icon: <WhatsAppIcon sx={{ fontSize: 20 }} />, href: 'https://wa.me/zaimgo', label: 'WhatsApp' },
  { icon: <VkIcon sx={{ fontSize: 20 }} />, href: 'https://vk.com/zaimgo', label: 'VK' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f172a',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ py: 5 }}>
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  component={Link}
                  href="/"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    '&:focus-visible': {
                      outline: '2px solid #10b981',
                      outlineOffset: 3,
                      borderRadius: 1.5,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    <TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'white',
                      fontSize: '1.1rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ZaimGo
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.7,
                  maxWidth: 280,
                  mb: 2.5,
                }}
              >
                Агрегатор микрофинансовых организаций. Сравниваем условия, находим лучшие предложения и помогаем получить займ.
              </Typography>
              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {SOCIAL_LINKS.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.7)',
                      p: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #10b981',
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* Links Columns */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '0.875rem',
                  mb: 2,
                }}
              >
                Услуги
              </Typography>
              <Stack component="nav" spacing={1}>
                {FOOTER_LINKS.main.map((link) => (
                  <Box
                    key={link.label}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#10b981',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #10b981',
                        outlineOffset: 2,
                        borderRadius: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '0.875rem',
                  mb: 2,
                }}
              >
                Информация
              </Typography>
              <Stack component="nav" spacing={1}>
                {FOOTER_LINKS.info.map((link) => (
                  <Box
                    key={link.label}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#10b981',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #10b981',
                        outlineOffset: 2,
                        borderRadius: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Legal & Contacts */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: '0.875rem',
                  mb: 2,
                }}
              >
                Контакты
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="a"
                    href="mailto:support@zaimgo.ru"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#10b981',
                      },
                    }}
                  >
                    support@zaimgo.ru
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    Пн-Вс: 09:00 — 21:00 МСК
                  </Typography>
                </Box>
              </Stack>
              
              {/* Legal Links */}
              <Box sx={{ mt: 3 }}>
                <Stack component="nav" spacing={0.75}>
                  {FOOTER_LINKS.legal.map((link) => (
                    <Box
                      key={link.label}
                      component={Link}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid #10b981',
                          outlineOffset: 2,
                          borderRadius: 1,
                        },
                      }}
                    >
                      {link.label}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            py: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {currentYear} ZaimGo. Все права защищены.
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.7rem',
              textAlign: { xs: 'center', sm: 'right' },
              maxWidth: 500,
            }}
          >
            Сервис не является кредитной организацией. Информация носит справочный характер.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
