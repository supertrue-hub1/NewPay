'use client'

import { Container, Typography, Box, Card, CardContent, Grid, TextField, Button, Slider } from '@mui/material'
import { useState } from 'react'

export default function ZaimContent() {
  const [sum, setSum] = useState(10000)
  const [term, setTerm] = useState(10)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const calculateTotal = () => {
    return Math.round(sum * (0.008 * term) * 100) / 100 + sum
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Заявка отправлена! Сумма: ${calculateTotal()} ₽`)
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
              Получить займ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Заполните заявку и получите деньги на карту за 5 минут
            </Typography>

            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Выберите параметры займа</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Сумма: {sum.toLocaleString()} ₽</Typography>
                <Slider
                  value={sum}
                  onChange={(_, v) => setSum(v as number)}
                  min={1000}
                  max={30000}
                  step={1000}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Срок: {term} дней</Typography>
                <Slider
                  value={term}
                  onChange={(_, v) => setTerm(v as number)}
                  min={5}
                  max={30}
                />
              </Box>

              <Card sx={{ bgcolor: '#e8f5e9', p: 2, mb: 3 }}>
                <Grid container>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">Вы берете</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{sum.toLocaleString()} ₽</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">К возврату</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {calculateTotal().toLocaleString()} ₽
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>Оформить заявку</Typography>
              
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Сумма"
                  value={sum.toLocaleString()}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Срок (дней)"
                  value={term}
                  disabled
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ bgcolor: '#4caf50', py: 1.5, '&:hover': { bgcolor: '#388e3c' } }}
                >
                  Отправить заявку
                </Button>
              </form>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Нажимаю кнопку, вы соглашаетесь с обработкой персональных данных
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
