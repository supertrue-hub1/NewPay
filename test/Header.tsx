'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const NAV_ITEMS = [
  { label: 'Займы', href: '/loans' },
  { label: 'МФО', href: '/mfo' },
  { label: 'Рейтинг', href: '/rating' },
  { label: 'Акции', href: '/promotions' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
];

function useStickyTrigger() {
  return useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isSticky = useStickyTrigger();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const drawerContent = (
    <Box
      sx={{
        width: 260,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f172a',
      }}
      role="navigation"
      aria-label="Мобильное меню"
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: 'white',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            ZaimGo
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="Закрыть меню"
          sx={{ color: 'rgba(255,255,255,0.7)', p: 0.5 }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1.5, px: 1.5 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.href}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              mb: 0.25,
              py: 1.25,
              px: 1.5,
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
              },
              '&:focus-visible': {
                outline: '2px solid #10b981',
                outlineOffset: 2,
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom actions */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Button
          component={Link}
          href="/select-loan"
          fullWidth
          onClick={handleDrawerToggle}
          sx={{
            py: 1.25,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
            bgcolor: '#10b981',
            color: 'white',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              bgcolor: '#059669',
            },
          }}
        >
          Подобрать займ
        </Button>
        <Button
          component={Link}
          href="/login"
          fullWidth
          startIcon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 1.5,
            py: 1.25,
            borderRadius: 2,
            fontWeight: 500,
            textTransform: 'none',
            fontSize: '0.875rem',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.25)',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          Войти
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        component="header"
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: isSticky ? 'rgba(15, 23, 42, 0.95)' : '#0f172a',
          backdropFilter: isSticky ? 'blur(12px)' : 'none',
          transition: 'all 0.25s ease',
          boxShadow: isSticky ? '0 2px 12px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 52, md: 56 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                '&:focus-visible': {
                  outline: '2px solid #10b981',
                  outlineOffset: 3,
                  borderRadius: 1.5,
                },
              }}
              aria-label="На главную"
            >
              <Box
                sx={{
                  width: { xs: 32, md: 34 },
                  height: { xs: 32, md: 34 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                }}
              >
                <TrendingUpIcon sx={{ color: 'white', fontSize: { xs: 18, md: 19 } }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  letterSpacing: '-0.01em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                ZaimGo
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              component="nav"
              aria-label="Основная навигация"
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.25,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    minWidth: 'auto',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: '2px',
                      bgcolor: '#10b981',
                      borderRadius: 1,
                      transition: 'width 0.2s ease',
                    },
                    '&:hover': {
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '&::after': {
                        width: '50%',
                      },
                    },
                    '&:focus-visible': {
                      outline: '2px solid #10b981',
                      outlineOffset: 2,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Actions */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
              }}
            >
              <Button
                component={Link}
                href="/login"
                startIcon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  minWidth: 'auto',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'white',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #10b981',
                    outlineOffset: 2,
                  },
                }}
              >
                Войти
              </Button>
              <Button
                component={Link}
                href="/select-loan"
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#059669',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #10b981',
                    outlineOffset: 2,
                  },
                }}
              >
                Подобрать займ
              </Button>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Открыть меню"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              sx={{
                display: { xs: 'flex', lg: 'none' },
                color: 'white',
                p: 0.75,
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
                '&:focus-visible': {
                  outline: '2px solid #10b981',
                  outlineOffset: 2,
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        id="mobile-drawer"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Toolbar offset */}
      <Box sx={{ height: { xs: 52, md: 56 } }} />
    </>
  );
}
