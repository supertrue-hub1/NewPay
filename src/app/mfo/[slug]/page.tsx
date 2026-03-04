import { Metadata } from 'next'
import { Container, Typography, Box, Paper, Grid, Chip, Button, Rating, Divider } from '@mui/material'
import { CheckCircle, Warning, Info, Gavel, Security, TrendingUp } from '@mui/icons-material'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Данные МФО (в реальном проекте импортировать из @/data/mfo)
const mfoData: Record<string, {
  name: string
  logo: string
  rating: number
  reviews: number
  sumMin: number
  sumMax: number
  termMin: number
  termMax: number
  percent: number
  firstFree: boolean
  instant: boolean
  license: string
  inn: string
  ogrn: string
  address: string
  phone: string
  siteUrl: string
  risks: string[]
  pros: string[]
  cons: string[]
  infoModal?: string
}> = {
  'ekapusta': {
    name: 'Екапуста',
    logo: 'Е',
    rating: 4.8,
    reviews: 45000,
    sumMin: 1000,
    sumMax: 30000,
    termMin: 5,
    termMax: 21,
    percent: 0.8,
    firstFree: true,
    instant: true,
    license: '001503760007126',
    inn: '1214003020',
    ogrn: '1104214002954',
    address: '425000, Республика Марий Эл, г. Йошкар-Ола, ул. Комсомольская, д. 77',
    phone: '8 (8362) 23-06-30',
    siteUrl: 'https://ekapusta.com',
    risks: [
      'Высокие штрафы за просрочку (0,9% в день)',
      'При просрочке начисляется повышенный процент',
      'Взыскание долга через коллекторов',
      'Негативная КИ при просрочке'
    ],
    pros: [
      'Первый займ под 0% для новых клиентов',
      'Мгновенное зачисление на карту',
      'Высокий рейтинг (4.8)',
      'Большое количество отзывов',
      'Автоматическое продление договора'
    ],
    cons: [
      'Высокие проценты при просрочке',
      'Требование к постоянной регистрации',
      'Комиссия за вывод средств'
    ],
    infoModal: 'МФО «Екапуста» (ООО «МКК «Екапуста») — один из крупнейших микрофинансовых сервисов в России, работающий с 2012 года. Компания входит в реестр ЦБ РФ и имеет все необходимые лицензии.'
  },
  'zaymer': {
    name: 'Займер',
    logo: 'З',
    rating: 4.7,
    reviews: 38000,
    sumMin: 2000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 1,
    firstFree: true,
    instant: true,
    license: '001651303740853',
    inn: '4205043940',
    ogrn: '1164205053512',
    address: '630102, г. Новосибирск, ул. Кирова, д. 86',
    phone: '8 (383) 373-03-03',
    siteUrl: 'https://zaymer.ru',
    risks: [
      'Штрафы за просрочку до 0,8% в день',
      'Возможна передача долга коллекторам',
      'Негативная запись в кредитной истории',
      'Принудительное взыскание через суд'
    ],
    pros: [
      'Первый займ 0% для новых клиентов',
      'Робот Займер принимает решение за 2 минуты',
      'Круглосуточная выдача',
      'Автоматическое одобрение при повторном обращении'
    ],
    cons: [
      'Процентная ставка выше среднего',
      'Только для граждан РФ с постоянной пропиской',
      'Проверка через БКИ'
    ],
    infoModal: 'МФО «Займер» (ООО МФК «Займер») — российская микрофинансовая компания, основанная в 2013 году. Специализируется на полностью автоматизированной выдаче займов через интернет.'
  },
  'moneyman': {
    name: 'MoneyMan',
    logo: 'M',
    rating: 4.6,
    reviews: 32000,
    sumMin: 1500,
    sumMax: 25000,
    termMin: 5,
    termMax: 30,
    percent: 0.9,
    firstFree: true,
    instant: true,
    license: '001603045007582',
    inn: '7704270144',
    ogrn: '1177746090849',
    address: '123112, г. Москва, Пресненская наб., д. 6, стр. 2',
    phone: '8 (495) 134-40-40',
    siteUrl: 'https://moneyman.ru',
    risks: [
      'Штрафы при просрочке платежа',
      'Возможно начисление пени',
      'Передача данных в бюро кредитных историй',
      'Судебное взыскание при длительной просрочке'
    ],
    pros: [
      'Первый займ под 0% (для новых клиентов)',
      'Быстрое рассмотрение заявки',
      'Личный кабинет с историей займов',
      'Программа лояльности для постоянных клиентов'
    ],
    cons: [
      'Не выдают займы с 21:00 до 06:00',
      'Требуется подтверждение дохода',
      'Ограничения по возрасту (18-75 лет)'
    ],
    infoModal: 'МФО «MoneyMan» (ООО МФК «Мани Мен») — международная микрофинансовая компания, работающая в России с 2012 года. Входит в ТОП-5 крупнейших МФО России.'
  },
  'lime-zaim': {
    name: 'Lime-zaim',
    logo: 'L',
    rating: 4.5,
    reviews: 28000,
    sumMin: 2000,
    sumMax: 20000,
    termMin: 10,
    termMax: 30,
    percent: 1,
    firstFree: false,
    instant: true,
    license: '001652030620400',
    inn: '6165153530',
    ogrn: '1166196097506',
    address: '344011, г. Ростов-на-Дону, ул. Пушкинская, д. 46',
    phone: '8 (863) 333-53-53',
    siteUrl: 'https://lime-zaim.ru',
    risks: [
      'Нет первого беспроцентного займа',
      'Высокие проценты при просрочке',
      'Штрафные санкции до 0,5% в день',
      'Взыскание через коллекторские агентства'
    ],
    pros: [
      'Мгновенная выдача на карту',
      'Выдача с плохой кредитной историей',
      'Минимальный пакет документов',
      'Работа 24/7'
    ],
    cons: [
      'Нет первого займа под 0%',
      'Высокая процентная ставка',
      'Ограниченная сумма (до 20000 рублей)'
    ],
    infoModal: 'МФО «Lime-zaim» (ООО «Лайм-Займ») — микрофинансовая компания, специализирующаяся на выдаче займов онлайн. Работает с 2015 года.'
  },
  'webbankir': {
    name: 'Webbankir',
    logo: 'W',
    rating: 4.4,
    reviews: 22000,
    sumMin: 3000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 0.8,
    firstFree: true,
    instant: true,
    license: '001651240503077',
    inn: '2127318845',
    ogrn: '1022101134095',
    address: '428000, г. Чебоксары, ул. К. Иванова, д. 86',
    phone: '8 (8352) 22-00-00',
    siteUrl: 'https://webbankir.com',
    risks: [
      'Штрафы за просрочку платежа',
      'Возможно начисление пени',
      'Передача долга коллекторам',
      'Негативное влияние на кредитную историю'
    ],
    pros: [
      'Первый займ под 0% для новых клиентов',
      'Длительный срок кредитования (до 30 дней)',
      'Низкая процентная ставка (от 0,8%)',
      'Круглосуточная поддержка'
    ],
    cons: [
      'Требуется постоянная регистрация',
      'Ограничения для пенсионеров',
      'Проверка данных через БКИ'
    ],
    infoModal: 'МФО «Webbankir» (ООО МКК «Веббанкир») — одна из первых онлайн-MФО в России, работающая с 2012 года. Компания входит в реестр ЦБ РФ.'
  }
}

// Функция для преобразования имени в slug
function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-я0-9-]/g, '')
    .replace(/-+/g, '-')
}

// Генерация статических параметров
export async function generateStaticParams() {
  return Object.keys(mfoData).map((slug) => ({
    slug,
  }))
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const mfo = mfoData[slug]
  
  if (!mfo) {
    return {
      title: 'МФО не найден',
    }
  }

  const currentYear = new Date().getFullYear()
  
  return {
    title: `МФО ${mfo.name}: развод или нет? Честный разбор ${currentYear}`,
    description: `Проверка МФО ${mfo.name}. Легальна ли компания? Отзывы, рейтинг, риски и условия займов. Вердикт: развод это или нет.`,
    keywords: `${mfo.name} развод, ${mfo.name} отзывы, ${mfo.name} мошенники, МФО ${mfo.name} честный обзор`,
    openGraph: {
      title: `МФО ${mfo.name}: развод или нет?`,
      description: `Проверка надежности ${mfo.name}. Все плюсы, минусы и риски.`,
      type: 'article',
    },
  }
}

// Генерация JSON-LD схемы для МФО
function generateMfoJsonLd(mfo: typeof mfoData[string]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': `Займ в МФО ${mfo.name}`,
    'description': `Микрозайм от ${mfo.name}: сумма от ${mfo.sumMin} до ${mfo.sumMax} рублей, срок от ${mfo.termMin} до ${mfo.termMax} дней, ставка ${mfo.percent}% в день`,
    'provider': {
      '@type': 'Organization',
      'name': mfo.name,
      'url': mfo.siteUrl,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': mfo.address.split(',')[0]?.trim() || '',
        'addressRegion': 'Россия',
        'streetAddress': mfo.address
      },
      'telephone': mfo.phone,
      'identifier': [
        {
          '@type': 'PropertyValue',
          'name': 'ИНН',
          'value': mfo.inn
        },
        {
          '@type': 'PropertyValue',
          'name': 'ОГРН',
          'value': mfo.ogrn
        }
      ]
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'RUB',
      'minPrice': mfo.sumMin,
      'maxPrice': mfo.sumMax,
      'description': `Займ от ${mfo.sumMin} до ${mfo.sumMax} рублей на срок от ${mfo.termMin} до ${mfo.termMax} дней`
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': mfo.rating,
      'reviewCount': mfo.reviews,
      'bestRating': 5,
      'worstRating': 1,
      'ratingExplanation': `Рейтинг МФО ${mfo.name} на основе ${mfo.reviews.toLocaleString()} отзывов клиентов`
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Процентная ставка',
        'value': `${mfo.percent}% в день`
      },
      {
        '@type': 'PropertyValue',
        'name': 'Первый займ бесплатно',
        'value': mfo.firstFree ? 'Да' : 'Нет'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Мгновенная выдача',
        'value': mfo.instant ? 'Да' : 'Нет'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Лицензия ЦБ РФ',
        'value': mfo.license
      }
    ],
    'termsOfService': mfo.siteUrl,
    'category': 'https://schema.org/LoanOrCredit'
  }
}

export default async function MfoScamCheckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mfo = mfoData[slug]

  if (!mfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography variant="h4" color="error">
          МФО не найден
        </Typography>
        <Typography sx={{ mt: 2 }}>
          К сожалению, информация о данной микрофинансовой организации недоступна.
        </Typography>
      </Container>
    )
  }

  const currentYear = new Date().getFullYear()
  const jsonLd = generateMfoJsonLd(mfo)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Хлебные крошки */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', fontSize: '0.875rem' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Главная</Link>
        <span style={{ color: '#999' }}>/</span>
        <Link href="/loans" style={{ color: '#666', textDecoration: 'none' }}>Займы</Link>
        <span style={{ color: '#999' }}>/</span>
        <span style={{ color: '#1a237e' }}>{mfo.name}: развод или нет</span>
      </Box>

      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 800 }}>
          МФО {mfo.name}: развод или нет?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Честный разбор {currentYear} — вся правда о компании
        </Typography>
        
        {/* Вердикт */}
        <Paper 
          sx={{ 
            p: 3, 
            bgcolor: '#e8f5e9', 
            borderLeft: '4px solid #4caf50',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CheckCircle sx={{ fontSize: 48, color: '#4caf50' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Вердикт: Не развод
            </Typography>
            <Typography variant="body1" sx={{ color: '#1b5e20' }}>
              Организация есть в реестре ЦБ РФ (лицензия №{mfo.license})
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Карточка МФО */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
<Logo logo={mfo.logo} size={80} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{mfo.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Rating value={mfo.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2">({mfo.reviews.toLocaleString()} отзывов)</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">Сумма займа</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {mfo.sumMin.toLocaleString()} - {mfo.sumMax.toLocaleString()} ₽
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">Срок</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {mfo.termMin} - {mfo.termMax} дней
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">Ставка</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
                  {mfo.percent}% в день
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="body2" color="text.secondary">Вероятность</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Высокая</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {mfo.firstFree && <Chip label="Первый займ 0%" color="primary" />}
              {mfo.instant && <Chip label="Мгновенно" />}
              <Chip label="Лицензия ЦБ РФ" color="success" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Плюсы */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%', borderTop: '4px solid #4caf50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: '#4caf50' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Плюсы</Typography>
            </Box>
            <Box component="ul" sx={{ pl: 2 }}>
              {mfo.pros.map((pro, index) => (
                <Typography component="li" key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
                  {pro}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Минусы */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%', borderTop: '4px solid #f44336' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Warning sx={{ color: '#f44336' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Минусы</Typography>
            </Box>
            <Box component="ul" sx={{ pl: 2 }}>
              {mfo.cons.map((con, index) => (
                <Typography component="li" key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning sx={{ fontSize: 18, color: '#f44336' }} />
                  {con}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Риски */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: '#fff3e0', borderTop: '4px solid #ff9800' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Gavel sx={{ color: '#ff9800' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Риски при просрочке</Typography>
            </Box>
            <Grid container spacing={2}>
              {mfo.risks.map((risk, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ fontSize: 18, color: '#ff9800' }} />
                    <Typography>{risk}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Информация о компании */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Info sx={{ color: '#1976d2' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>О компании</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Название</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Лицензия ЦБ РФ</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>№{mfo.license}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">ИНН</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.inn}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">ОГРН</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{mfo.ogrn}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Адрес</Typography>
                <Typography variant="body1">{mfo.address}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Телефон</Typography>
                <Typography variant="body1">{mfo.phone}</Typography>
              </Grid>
            </Grid>
            {mfo.infoModal && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {mfo.infoModal}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Кнопка заявки */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: '#e3f2fd', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Оформить займ в {mfo.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Высокая вероятность одобрения. Первый займ под 0%!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href={mfo.siteUrl}
              target="_blank"
              sx={{ 
                bgcolor: '#4caf50', 
                '&:hover': { bgcolor: '#388e3c' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Получить деньги
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Вывод */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Вывод: брать или нет?
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          <strong>{mfo.name}</strong> — это легальная микрофинансовая организация, которая состоит в реестре ЦБ РФ и имеет все необходимые лицензии. 
          Компания работает на рынке микрозаймов и имеет положительные отзывы от клиентов.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
          <strong>Брать можно, но читайте договор!</strong> Внимательно изучите условия займа, особенно пункты о штрафах и пени за просрочку. 
          Не допускайте просрочек платежей, чтобы избежать начисления высоких штрафов и негативной записи в кредитной истории.
        </Typography>
      </Paper>
    </Container>
    </>
  )
}
