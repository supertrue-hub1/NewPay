'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material'

const navItems = [
  { label: 'Главная', href: '/' },
  { label: 'Займы', href: '/allmfo' },
  { label: 'Сравнить', href: '/mfo' },
  { label: 'Кредитные карты', href: '/cards' },
  { label: 'Статьи', href: '/articles' },
]

const Logo = () => (
  <Link href="/" style={{ display: 'flex', alignItems: 'center' }} suppressHydrationWarning>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 120" width="260" height="65" style={{ marginRight: 16, transform: 'scaleX(1.1)' }} suppressHydrationWarning>
      <g transform="translate(20,20) scale(1.4)">
        <path d="M6 34 L54 6 L46 46 L30 34 L6 34 Z" fill="#ffffff"/>
        <path d="M20 30 L43 12 L38 32 L20 30 Z" fill="#0b2340"/>
        <path d="M6 34 L54 6 L46 46 L30 34 L6 34 Z" fill="none" stroke="#e8f6ff" strokeWidth="1"/>
        <path d="M8 52 C20 64, 38 64, 54 54" fill="none" stroke="#00b6ff" strokeWidth="4" strokeLinecap="round"/>
        <path d="M8 58 C20 70, 38 70, 54 60" fill="none" stroke="#00a0d9" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      </g>
      <text x="130" y="76" fill="#ffffff" fontFamily="Montserrat, Arial, sans-serif" fontWeight="700" fontSize="36">
        NewPay.ru
      </text>
    </svg>
  </Link>
)

export default function Navigation() {
  const pathname = usePathname() ?? ''

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a237e' }} suppressHydrationWarning>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo />
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  color: 'white',
                  bgcolor: pathname === item.href ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 2,
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={Link}
              href="/admin"
              sx={{ color: 'rgba(255,255,255,0.7)', ml: 2 }}
            >
              Админ
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
