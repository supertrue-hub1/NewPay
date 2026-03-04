'use client'

import { useState } from 'react'
import { Container, Typography, Box, Paper, Grid, Button, Chip, Divider } from '@mui/material'
import { LocalOffer, ArrowForward, Star, Percent, ContentCopy, Check } from '@mui/icons-material'
import Link from 'next/link'

interface PromoCode {
  id: number
  mfoName: string
  logo: string
  promoCode: string
  discount: string
  conditions: string
  siteUrl: string
  isExclusive?: boolean
}

const promoCodes: PromoCode[] = [
  {
    id: 1,
    mfoName: 'Екапуста',
    logo: 'Е',
    promoCode: 'NewPay',
    discount: 'До 15% скидка',
    conditions: 'При первом займе от 5000 ₽. Скидка автоматически применяется при переходе.',
    siteUrl: 'https://ekapusta.com',
    isExclusive: true,
  },
  {
    id: 2,
    mfoName: 'Займер',
    logo: 'З',
    promoCode: 'SRAVNI10',
    discount: '10% скидка',
    conditions: 'На первый займ. Промокод не требуется - скидка применяется автоматически.',
    siteUrl: 'https://zaymer.ru',
  },
  {
    id: 3,
    mfoName: 'MoneyMan',
    logo: 'M',
    promoCode: 'MONEY100',
    discount: '100 ₽ бесплатно',
    conditions: 'При регистрации. Бонус зачисляется автоматически на первый займ.',
    siteUrl: 'https://moneyman.ru',
  },
  {
    id: 4,
    mfoName: 'Lime-zaim',
    logo: 'L',
    promoCode: 'LIME500',
    discount: '500 ₽ в подарок',
    conditions: 'Новым клиентам при первом займе от 8000 ₽.',
    siteUrl: 'https://lime-zaim.ru',
  },
  {
    id: 5,
    mfoName: 'Webbankir',
    logo: 'W',
    promoCode: '',
    discount: '0% первый займ',
    conditions: 'Для новых клиентов - первый займ до 30 дней без процентов!',
    siteUrl: 'https://webbankir.com',
    isExclusive: true,
  },
  {
    id: 6,
    mfoName: 'Быстроденьги',
    logo: 'Б',
    promoCode: 'SPEED200',
    discount: '200 ₽ на баланс',
    conditions: 'За регистрацию. Бонус можно использовать для погашения займа.',
    siteUrl: 'https://bistrodeneg.ru',
  },
  {
    id: 7,
    mfoName: 'Турбозайм',
    logo: 'Т',
    promoCode: 'TURBO15',
    discount: '15% скидка',
    conditions: 'На все последующие займы. Действует при продлении.',
    siteUrl: 'https://turbocredit.ru',
  },
  {
    id: 8,
    mfoName: 'Конга',
    logo: 'К',
    promoCode: 'KONGA50',
    discount: '50% скидка на проценты',
    conditions: 'При досрочном погашении. Сэкономьте на процентах!',
    siteUrl: 'https://konga.ru',
  },
]

export default function PromokodyPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = async (promoCode: string, id: number) => {
    try {
      await navigator.clipboard.writeText(promoCode)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800, display: { xs: 'none', md: 'block' } }}>
          Промокоды и скидки на займы
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
          Актуальные промокоды и бонусы от МФО — экономьте на займах!
        </Typography>

        {/* SEO текст */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Percent color="primary" />
            Как использовать промокоды?
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Большинство промокодов для МФО не требуют ручного ввода — скидка применяется автоматически при переходе с нашего сайта. 
            Просто нажмите кнопку "Получить скидку" и вы будете перенаправлены на сайт МФО с уже активированным предложением.
          </Typography>
          
          <Typography variant="body1">
            <strong>Почему это работает:</strong> Мы партнёры с МФО и передаём информацию о вашем переходе, 
            поэтому скидка применяется автоматически. Это самый простой способ получить выгоду!
          </Typography>
        </Paper>

        {/* Список промокодов */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Актуальные предложения
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {promoCodes.map((promo) => (
            <Grid size={{ xs: 12, md: 6 }} key={promo.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  }
                }}
              >
                {promo.isExclusive && (
                  <Chip 
                    label="ЭКСКЛЮЗИВ" 
                    color="error" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      fontWeight: 600,
                    }} 
                  />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: 2,
                      bgcolor: '#4f46e5',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    {promo.logo}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {promo.mfoName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#ffb400' }} />
                      <Typography variant="body2" color="text.secondary">
                        Рекомендуем
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box 
                  sx={{ 
                    bgcolor: promo.promoCode ? '#e8f5e9' : '#fff3e0',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: promo.promoCode ? '#2e7d32' : '#e65100',
                    }}
                  >
                    {promo.discount}
                  </Typography>
                  {promo.promoCode && (
                    <Box 
                      sx={{ 
                        mt: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        borderRadius: 1,
                        px: 2,
                        py: 0.5,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCopy(promo.promoCode, promo.id)}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: '#2e7d32',
                        }}
                      >
                        {promo.promoCode}
                      </Typography>
                      {copiedId === promo.id ? (
                        <Check sx={{ fontSize: 16, color: '#2e7d32' }} />
                      ) : (
                        <ContentCopy sx={{ fontSize: 16, color: '#2e7d32' }} />
                      )}
                    </Box>
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                  {promo.conditions}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Button 
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
                  component="a"
                  href={promo.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    py: 1.5,
                    bgcolor: '#4f46e5',
                    '&:hover': {
                      bgcolor: '#4338ca',
                    },
                  }}
                >
                  Получить скидку
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Дополнительная информация */}
        <Paper sx={{ p: 4, mb: 4, bgcolor: '#e3f2fd' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalOffer color="primary" />
            Часто задаваемые вопросы о промокодах
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Нужно ли вводить промокод вручную?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              В большинстве случаев промокод вводить не нужно — скидка применяется автоматически при переходе с нашего сайта. 
              Если требуется ввод промокода, это указано в условиях.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Можно ли использовать несколько промокодов?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Обычно МФО разрешают использовать только один промокод на один займ. 
              Выберите самое выгодное предложение.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Сколько раз можно использовать промокод?
            </Typography>
            <Typography variant="body2">
              Большинство промокодов на скидку действуют только для новых клиентов. 
              Для повторных займов доступны промокоды на продление или досрочное погашение.
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Button 
            variant="outlined" 
            component={Link} 
            href="/loans"
            size="large"
          >
            Выбрать займ
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
