'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Button, Slider, Breadcrumbs, Link, Chip } from '@mui/material'
import { useState, useEffect } from 'react'
import { City } from '@/data/cities'
import { MFO } from '@/data/mfo'
import { mfoData as staticMfoData } from '@/data/mfo-data'
import Logo from '@/components/Logo'

interface Props {
  city: City
}

const cityTexts: Record<string, { hero: string; text: string; advantages: string[] }> = {
  moskva: {
    hero: 'Займы онлайн в Москве — деньги за 5 минут',
    text: 'Жители Москвы могут получить перевод на карту за 5 минут. Более 50 МФО готовы выдать займ без отказа. Оформите заявку и получите деньги прямо на карту любого банка.',
    advantages: ['Мгновенный перевод на карту', 'Без посещения офиса', 'Круглосуточное оформление', 'Персональные условия'],
  },
  'sankt-peterburg': {
    hero: 'Займы онлайн в Санкт-Петербурге — быстрые деньги',
    text: 'Жители Санкт-Петербурга могут оформить займ онлайн и получить деньги на карту за 5 минут. Работаем со всеми банками России. Первый займ под 0%.',
    advantages: ['Одобрение за 2 минуты', 'Перевод на карту Сбербанка', 'Без справок о доходах', 'Первый займ 0%'],
  },
  novosibirsk: {
    hero: 'Займы онлайн в Новосибирске — срочно и без отказа',
    text: 'Новосибирцы могут получить займ на карту через 5 минут после подачи заявки. Более 30 проверенных МФО с лучшими условиями. Работаем с плохой КИ.',
    advantages: ['Быстрое одобрение', 'На любую карту', 'С плохой КИ', 'Первый займ бесплатно'],
  },
  ekaterinburg: {
    hero: 'Займы онлайн в Екатеринбурге — деньги за 5 минут',
    text: 'Жители Екатеринбурга могут оформить микрозайм онлайн. Мы подобрали лучшие предложения с мгновенным переводом на карту. Без отказа и проверок.',
    advantages: ['За 5 минут на карту', 'Без отказа', 'Круглосуточно', '0% первый займ'],
  },
  kazan: {
    hero: 'Займы онлайн в Казани — быстрые микрозаймы',
    text: 'Оформите займ онлайн в Казани. Перевод на карту за 5 минут. Работаем со всеми банками Татарстана. Первый займ под 0% для новых клиентов.',
    advantages: ['Мгновенное одобрение', 'Без справок', 'На любую карту', 'С плохой историей'],
  },
  'nizhny-novgorod': {
    hero: 'Займы онлайн в Нижнем Новгороде — срочный займ',
    text: 'Жители Нижнего Новгорода могут получить займ на карту за 5 минут. Лучшие условия от проверенных МФО. Без проверки кредитной истории.',
    advantages: ['Быстрое одобрение', 'На любую карту', 'С плохой КИ', 'Круглосуточно'],
  },
  chelyabinsk: {
    hero: 'Займы онлайн в Челябинске — деньги срочно',
    text: 'Оформите займ онлайн в Челябинске. Перевод на карту за 5 минут. Работаем со всеми банками. Первый займ под 0% для новых клиентов.',
    advantages: ['Мгновенный перевод', 'Без отказа', 'Без справок', '24/7'],
  },
  samara: {
    hero: 'Займы онлайн в Самаре — быстрые деньги',
    text: 'Получите займ в Самаре за 5 минут. Лучшие МФО с мгновенным одобрением. Перевод на любую банковскую карту.',
    advantages: ['За 5 минут', 'Без проверки КИ', 'На карту любого банка', 'Первый займ 0%'],
  },
  omsk: {
    hero: 'Займы онлайн в Омске — срочный займ на карту',
    text: 'Жители Омска могут оформить займ онлайн и получить деньги на карту за 5 минут. Работаем с плохой кредитной историей.',
    advantages: ['Быстрое одобрение', 'С плохой КИ', 'Круглосуточно', 'Без отказа'],
  },
  'rostov-na-donu': {
    hero: 'Займы онлайн в Ростове-на-Дону — деньги за 5 минут',
    text: 'Ростовчане могут получить займ на карту за 5 минут. Лучшие предложения от проверенных МФО. Первый займ под 0%.',
    advantages: ['Мгновенный перевод', 'Без справок', 'С плохой КИ', '0% первый займ'],
  },
}

const getDefaultText = (cityName: string, cityGenitive: string) => ({
  hero: `Займы онлайн в ${cityName} — быстрые микрозаймы`,
  text: `Жители ${cityGenitive} могут получить займ на карту за 5 минут. Оформите онлайн-заявку и получите деньги мгновенно. Работаем со всеми банками России.`,
  advantages: ['Мгновенное одобрение', 'Перевод на любую карту', 'Без проверки КИ', 'Работаем 24/7'],
})

export default function CityPageContent({ city }: Props) {
  const [mfoData, setMfoData] = useState<MFO[]>(staticMfoData)
  const [sum, setSum] = useState(10000)
  const [days, setDays] = useState(7)

  // Загрузка данных из localStorage
  useEffect(() => {
    const storedMfo = localStorage.getItem('mfo')
    if (storedMfo) {
      try {
        const parsed = JSON.parse(storedMfo)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Дедупликация по уникальному ID
          const uniqueMfo = parsed.filter((item: MFO, index: number, self: MFO[]) => 
            index === self.findIndex((m: MFO) => m.id === item.id)
          )
          setMfoData(uniqueMfo)
        }
      } catch (e) {
        console.error('Error parsing MFO data:', e)
      }
    }
  }, [])

  const cityText = cityTexts[city.slug] || getDefaultText(city.name, city.nameGenitive)

  return (
    <Box sx={{ pt: 12, pb: 8, minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        {/* Хлебные крошки */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" underline="hover" color="inherit">Главная</Link>
          <Link href="/zajmy-online" underline="hover" color="inherit">Займы онлайн</Link>
          <Typography color="text.primary">{city.name}</Typography>
        </Breadcrumbs>

        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 26, md: 40 }, fontWeight: 700, mb: 2, color: '#1e293b' }}>
            {cityText.hero}
          </Typography>
          <Typography sx={{ fontSize: { xs: 15, md: 17 }, color: '#64748b', maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
            {cityText.text}
          </Typography>
        </Box>

        {/* Преимущества */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {cityText.advantages.map((adv, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <Card sx={{ textAlign: 'center', py: 2.5, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600, color: '#4f46e5', fontSize: 15 }}>{adv}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Калькулятор */}
        <Card sx={{ mb: 6, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Рассчитайте займ {city.nameDative}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Сумма: {sum.toLocaleString()} ₽</Typography>
              <Slider
                value={sum}
                onChange={(_, v) => setSum(v as number)}
                min={1000}
                max={50000}
                step={1000}
                sx={{ color: '#4f46e5' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                <span>1 000 ₽</span>
                <span>50 000 ₽</span>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Срок: {days} дней</Typography>
              <Slider
                value={days}
                onChange={(_, v) => setDays(v as number)}
                min={1}
                max={30}
                step={1}
                sx={{ color: '#4f46e5' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 14 }}>
                <span>1 день</span>
                <span>30 дней</span>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              К возврату: <span style={{ color: '#4f46e5' }}>{Math.round(sum * (1 + days * 0.01)).toLocaleString()} ₽</span>
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>при 1% в день</Typography>
          </Box>
        </Card>

        {/* МФО карточками */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Все МФО для займа в {city.name}
        </Typography>
        
        <Grid container spacing={2}>
          {mfoData.map((mfo) => (
            <Grid size={{ xs: 6, md: 3 }} key={mfo.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  width: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Logo logo={mfo.logo} size={50} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{mfo.name}</Typography>
                      </Box>
                    </Box>
                    {mfo.badge && <Chip label={mfo.badge} color="success" size="small" />}
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Сумма</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Срок</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {mfo.termMin}-{mfo.termMax} дней
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Ставка</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        {mfo.percent}% в день
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">Вероятность</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Высокая</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {mfo.firstFree && <Chip label="Первый займ 0%" color="primary" size="small" />}
                    {mfo.instant && <Chip label="Мгновенно" size="small" />}
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      href={mfo.siteUrl || '#'}
                      target="_blank"
sx={{ bgcolor: '#4caf50', borderRadius: 2, '&:hover': { bgcolor: '#388e3c' } }}
                    >
                      Получить деньги
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SEO текст после карточек */}
        <Card sx={{ mt: 6, mb: 6, borderRadius: 4, p: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Как получить займ {city.nameDative}?
          </Typography>
          <Typography sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
            1. Выберите сумму и срок займа на калькуляторе выше.<br/>
            2. Нажмите кнопку «Получить деньги» и перейдите на сайт МФО.<br/>
            3. Заполните заявку на займ — потребуется только паспорт.<br/>
            4. Дождитесь решения (обычно 2-5 минут).<br/>
            5. Получите деньги на банковскую карту мгновенно.
          </Typography>
          <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
            Мы сотрудничаем только с лицензированными МФО, которые работают официально и предоставляют прозрачные условия займа.
          </Typography>
        </Card>

        {/* Другие города */}
        <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
          Займы в других городах
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['moskva', 'sankt-peterburg', 'novosibirsk', 'ekaterinburg', 'kazan'].filter(s => s !== city.slug).map((slug) => (
            <Button
              key={slug}
              variant="outlined"
              size="small"
              href={`/zajmy-online/${slug}`}
              sx={{ 
                borderRadius: 2, 
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': { borderColor: '#4f46e5', color: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.04)' }
              }}
            >
              {slug === 'moskva' ? 'Москва' : slug === 'sankt-peterburg' ? 'Санкт-Петербург' : slug === 'novosibirsk' ? 'Новосибирск' : slug === 'ekaterinburg' ? 'Екатеринбург' : 'Казань'}
            </Button>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
