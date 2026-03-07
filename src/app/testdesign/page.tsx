'use client';

import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import Header from '../../../test/Header';
import Footer from '../../../test/Footer';

// Демо данные МФО
const MFO_DATA = [
  { name: 'Займер', rate: 'от 0%', amount: 'до 30 000 ₽', time: '5 мин', color: '#10b981' },
  { name: 'Екапуста', rate: 'от 0%', amount: 'до 100 000 ₽', time: '7 мин', color: '#0ea5e9' },
  { name: 'MoneyMan', rate: 'от 0.5%', amount: 'до 80 000 ₽', time: '10 мин', color: '#8b5cf6' },
  { name: 'Webbankir', rate: 'от 0%', amount: 'до 50 000 ₽', time: '8 мин', color: '#f59e0b' },
  { name: 'Турбозайм', rate: 'от 0%', amount: 'до 25 000 ₽', time: '5 мин', color: '#ec4899' },
  { name: 'MigCredit', rate: 'от 0.8%', amount: 'до 100 000 ₽', time: '12 мин', color: '#14b8a6' },
];

export default function TestDesignPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Hero section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            bgcolor: 'white',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            },
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ mb: 2 }}>
            <Chip 
              label="Бесплатно" 
              size="small" 
              sx={{ bgcolor: '#dcfce7', color: '#059669', fontWeight: 600, fontSize: '0.75rem', height: 24 }} 
            />
            <Chip 
              label="50+ МФО" 
              size="small" 
              sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600, fontSize: '0.75rem', height: 24 }} 
            />
          </Stack>
          <Typography
            variant="h2"
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#0f172a',
              mb: 1.5,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Найдите идеальный займ за 2 минуты
          </Typography>
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#64748b',
              maxWidth: 500,
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Сравните предложения от проверенных микрофинансовых организаций. 
            Прозрачные условия, честные рейтинги.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: '#f0fdf4',
                borderRadius: 2,
                border: '1px solid #bbf7d0',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                До 100 000 ₽
              </Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #bfdbfe',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>
                От 0% первый займ
              </Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: '#fef3c7',
                borderRadius: 2,
                border: '1px solid #fde68a',
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
                За 5 минут
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Demo MFO cards */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: '#0f172a', mb: 2, fontSize: '1.1rem' }}
        >
          Популярные предложения
        </Typography>
        <Grid container spacing={2}>
          {MFO_DATA.map((mfo) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mfo.name}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    borderColor: 'transparent',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: mfo.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {mfo.name[0]}
                  </Box>
                  <Typography
                    sx={{ fontWeight: 600, color: '#0f172a', mb: 1, fontSize: '0.95rem' }}
                  >
                    {mfo.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={mfo.rate} size="small" sx={{ bgcolor: '#f0fdf4', color: '#059669', fontSize: '0.7rem', height: 22 }} />
                    <Chip label={mfo.amount} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.7rem', height: 22 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained"
            href="/allmfo"
            sx={{
              bgcolor: '#10b981',
              color: 'white',
              fontWeight: 600,
              py: 1.5,
              px: 4,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#059669',
              },
            }}
          >
            Все МФО
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
