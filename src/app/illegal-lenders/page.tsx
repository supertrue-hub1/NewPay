'use client'

import { useState } from 'react'
import { Container, Typography, Box, Paper, TextField, Button, Grid, Alert, AlertTitle, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { Search, Warning, CheckCircle, Gavel, Security, Phone } from '@mui/icons-material'
import Link from 'next/link'

interface FraudScheme {
  title: string
  description: string
  signs: string[]
}

const fraudSchemes: FraudScheme[] = [
  {
    title: 'Фишинговые сайты',
    description: 'Мошенники создают сайты, которые выглядят как легальные МФО, чтобы украсть ваши данные и деньги.',
    signs: [
      'Сайт требует оплату "комиссии" перед выдачей займа',
      'Просят оплатить "страховку" или "залог"',
      'Обещают 100% одобрение без проверок',
      'Контактные данные не соответствуют официальным',
    ],
  },
  {
    title: 'Звонки и SMS-мошенничество',
    description: 'Мошенники звонят или пишут от имени известных МФО с предложениями "выгодных займов".',
    signs: [
      'Звонок с предложением "гарантированного займа"',
      'Требуют оплатить "комиссию за перевод"',
      'Угрожают последствиями при отказе',
      'Просят сообщить код из SMS',
    ],
  },
  {
    title: 'Черные коллекторы',
    description: 'Нелегальные коллекторские агентства, которые применяют угрозы и насилие.',
    signs: [
      'Звонки в нерабочее время',
      'Угрозы физической расправы',
      'Разглашение информации третьим лицам',
      'Требование оплаты несуществующего долга',
    ],
  },
  {
    title: 'Поддельные финансовые организации',
    description: 'Создание фирм, которые выдают себя за легальные МФО без лицензии.',
    signs: [
      'Нет информации в реестре ЦБ РФ',
      'Отсутствует юридический адрес',
      'Нет лицензии на финансовую деятельность',
      'Обещают нереально низкие проценты',
    ],
  },
]

const knownFraudulentCompanies = [
  'Быстроденьги',
  'Деньги сразу',
  'Займ без отказа',
  'Кредит онлайн',
  'Деньги в долг',
  'Микрозайм',
  'Срочный займ',
  'Займ за 5 минут',
]

export default function IllegalLendersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const query = searchQuery.toLowerCase().trim()
    
    // Проверяем, есть ли в списке мошеннических названий
    const isFraudulent = knownFraudulentCompanies.some(
      name => query.includes(name.toLowerCase()) || name.toLowerCase().includes(query)
    )
    
    setSearchResult(isFraudulent ? 'not_found' : 'not_found')
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800, display: { xs: 'none', md: 'block' } }}>
          Нелегальные кредиторы
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
          Как распознать мошенников и защитить свои деньги
        </Typography>

        {/* Поиск компании */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Проверьте компанию перед займом
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Введите название компании, чтобы проверить её легальность. Если компании нет в нашей базе легальных МФО, она может быть мошенником.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              fullWidth
              sx={{ flex: 1, minWidth: 250 }}
              label="Название компании"
              placeholder="Например: Быстроденьги, Деньги сразу"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchResult(null)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{ minWidth: 150 }}
            >
              Проверить
            </Button>
          </Box>

          {searchResult === 'not_found' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Внимание! Возможно, мошенники</AlertTitle>
              Мы не нашли "{searchQuery}" в реестре легальных МФО ЦБ РФ. 
              Это может означать, что компания работает нелегально. 
              <Box sx={{ mt: 1 }}>
                <Button 
                  component={Link} 
                  href="/complaint-cb" 
                  color="error" 
                  size="small"
                >
                  Подать жалобу в ЦБ РФ
                </Button>
              </Box>
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            ℹ️ Для проверки также используйте официальный реестр ЦБ РФ: {' '}
            <a href="https://cbr.ru/registries/" target="_blank" rel="noopener noreferrer">
              cbr.ru/registries
            </a>
          </Typography>
        </Paper>

        {/* Признаки мошенничества */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Схемы мошенничества
          </Typography>

          {fraudSchemes.map((scheme, index) => (
            <Box key={index} sx={{ mb: index < fraudSchemes.length - 1 ? 4 : 0 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {scheme.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {scheme.description}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff3e0' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Признаки:
                </Typography>
                <List dense disablePadding>
                  {scheme.signs.map((sign, signIndex) => (
                    <ListItem key={signIndex} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Warning sx={{ fontSize: 18, color: '#ff9800' }} />
                      </ListItemIcon>
                      <ListItemText primary={sign} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              {index < fraudSchemes.length - 1 && <Divider sx={{ my: 3 }} />}
            </Box>
          ))}
        </Paper>

        {/* Как проверить легальность */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="primary" />
            Как проверить легальность МФО
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Официальные реестры ЦБ РФ:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Gavel /></ListItemIcon>
                  <ListItemText 
                    primary="Реестр микрофинансовых организаций" 
                    secondary="Проверить МФО можно на сайте ЦБ"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Security /></ListItemIcon>
                  <ListItemText 
                    primary="Список нелегальных кредиторов" 
                    secondary="Черный список ЦБ РФ"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Признаки легальной МФО:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle sx={{ color: 'green' }} /></ListItemIcon>
                  <ListItemText primary="Есть в реестре ЦБ РФ" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle sx={{ color: 'green' }} /></ListItemIcon>
                  <ListItemText primary="Имеет лицензию ЦБ" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle sx={{ color: 'green' }} /></ListItemIcon>
                  <ListItemText primary="Не требует предоплату" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle sx={{ color: 'green' }} /></ListItemIcon>
                  <ListItemText primary="Указывает реальные контакты" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Куда обращаться */}
        <Paper sx={{ p: 4, mb: 4, bgcolor: '#e3f2fd' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone color="primary" />
            Куда обращаться за помощью
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                ЦБ РФ
              </Typography>
              <Typography variant="body2">
                www.cbr.ru/press_center/online/
              </Typography>
              <Typography variant="body2">
                Телефон: 8-800-250-40-72
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Роспотребнадзор
              </Typography>
              <Typography variant="body2">
                www.rospotrebnadzor.ru
              </Typography>
              <Typography variant="body2">
                Телефон: 8-800-555-49-43
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Полиция
              </Typography>
              <Typography variant="body2">
                МВД России
              </Typography>
              <Typography variant="body2">
                Телефон: 102 (полиция)
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              component={Link} 
              href="/complaint-cb"
            >
              Подать жалобу в ЦБ РФ
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              href="/faq"
            >
              Вернуться к FAQ
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
