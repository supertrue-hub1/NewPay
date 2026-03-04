import { Metadata } from 'next'
import { query } from '@/lib/db'
import MfoOverviewClient from '@/components/MfoOverviewClient'

// Extended MFO type with all fields needed for the overview page
interface MfoData {
  id: number
  name: string
  logo: string
  slug: string
  rating: number
  reviews: number
  sumMin: number
  sumMax: number
  termMin: number
  termMax: number
  percent: number
  firstFree: boolean
  instant: boolean
  siteUrl?: string
  address?: string
  phone?: string
  inn?: string
  ogrn?: string
  license?: string
  pros?: string[]
  cons?: string[]
  risks?: string[]
  infoModal?: string
}

// Static fallback data for when DB is not available
const staticMfoData: Record<string, MfoData> = {
  'ekapusta': {
    id: 1,
    name: 'Екапуста',
    logo: 'Е',
    slug: 'ekapusta',
    rating: 4.8,
    reviews: 45000,
    sumMin: 1000,
    sumMax: 30000,
    termMin: 5,
    termMax: 21,
    percent: 0.8,
    firstFree: true,
    instant: true,
    siteUrl: 'https://ekapusta.com',
    address: '425000, Республика Марий Эл, г. Йошкар-Ола, ул. Комсомольская, д. 77',
    phone: '8 (8362) 23-06-30',
    inn: '1214003020',
    ogrn: '1104214002954',
    license: 'ЦБ РФ № 001503760007126',
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
    risks: [
      'Высокие штрафы за просрочку (0,9% в день)',
      'При просрочке начисляется повышенный процент',
      'Взыскание долга через коллекторов',
      'Негативная КИ при просрочке'
    ],
    infoModal: 'МФО «Екапуста» (ООО «МКК «Екапуста») — один из крупнейших микрофинансовых сервисов в России, работающий с 2012 года. Компания входит в реестр ЦБ РФ и имеет все необходимые лицензии для осуществления микрофинансовой деятельности. За время работы сервис выдал более 10 миллионов займов, что делает его одним из лидеров рынка.'
  },
  'zaymer': {
    id: 2,
    name: 'Займер',
    logo: 'З',
    slug: 'zaymer',
    rating: 4.7,
    reviews: 38000,
    sumMin: 2000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 1,
    firstFree: true,
    instant: true,
    siteUrl: 'https://zaymer.ru',
    address: '630102, г. Новосибирск, ул. Кирова, д. 86',
    phone: '8 (383) 373-03-03',
    inn: '4205043940',
    ogrn: '1164205053512',
    license: 'ЦБ РФ № 001651303740853',
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
    risks: [
      'Штрафы за просрочку до 0,8% в день',
      'Возможна передача долга коллекторам',
      'Негативная запись в кредитной истории',
      'Принудительное взыскание через суд'
    ],
    infoModal: 'МФО «Займер» (ООО МФК «Займер») — российская микрофинансовая компания, основанная в 2013 году. Специализируется на полностью автоматизированной выдаче займов через интернет. Использует современные технологии скоринга для принятия решений о выдаче займа.'
  },
  'moneyman': {
    id: 3,
    name: 'MoneyMan',
    logo: 'M',
    slug: 'moneyman',
    rating: 4.6,
    reviews: 32000,
    sumMin: 1500,
    sumMax: 25000,
    termMin: 5,
    termMax: 30,
    percent: 0.9,
    firstFree: true,
    instant: true,
    siteUrl: 'https://moneyman.ru',
    address: '123112, г. Москва, Пресненская наб., д. 6, стр. 2',
    phone: '8 (495) 134-40-40',
    inn: '7704270144',
    ogrn: '1177746090849',
    license: 'ЦБ РФ № 001603045007582',
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
    risks: [
      'Штрафы при просрочке платежа',
      'Возможно начисление пени',
      'Передача данных в бюро кредитных историй',
      'Судебное взыскание при длительной просрочке'
    ],
    infoModal: 'МФО «MoneyMan» (ООО МФК «Мани Мен») — международная микрофинансовая компания, работающая в России с 2012 года. Входит в ТОП-5 крупнейших МФО России. Компания имеет официальную лицензию ЦБ РФ и состоит в реестре микрофинансовых организаций.'
  },
  'lime-zaim': {
    id: 4,
    name: 'Lime-zaim',
    logo: 'L',
    slug: 'lime-zaim',
    rating: 4.5,
    reviews: 28000,
    sumMin: 2000,
    sumMax: 20000,
    termMin: 10,
    termMax: 30,
    percent: 1,
    firstFree: false,
    instant: true,
    siteUrl: 'https://lime-zaim.ru',
    address: '344011, г. Ростов-на-Дону, ул. Пушкинская, д. 46',
    phone: '8 (863) 333-53-53',
    inn: '6165153530',
    ogrn: '1166196097506',
    license: 'ЦБ РФ № 001652030620400',
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
    risks: [
      'Нет первого беспроцентного займа',
      'Высокие проценты при просрочке',
      'Штрафные санкции до 0,5% в день',
      'Взыскание через коллекторские агентства'
    ],
    infoModal: 'МФО «Lime-zaim» (ООО «Лайм-Займ») — микрофинансовая компания, специализирующаяся на выдаче займов онлайн. Работает с 2015 года и имеет лицензию ЦБ РФ на осуществление микрофинансовой деятельности.'
  },
  'webbankir': {
    id: 5,
    name: 'Webbankir',
    logo: 'W',
    slug: 'webbankir',
    rating: 4.4,
    reviews: 22000,
    sumMin: 3000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 0.8,
    firstFree: true,
    instant: true,
    siteUrl: 'https://webbankir.com',
    address: '428000, г. Чебоксары, ул. К. Иванова, д. 86',
    phone: '8 (8352) 22-00-00',
    inn: '2127318845',
    ogrn: '1022101134095',
    license: 'ЦБ РФ № 001651240503077',
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
    risks: [
      'Штрафы за просрочку платежа',
      'Возможно начисление пени',
      'Передача долга коллекторам',
      'Негативное влияние на кредитную историю'
    ],
    infoModal: 'МФО «Webbankir» (ООО МКК «Веббанкир») — одна из первых онлайн-MФО в России, работающая с 2012 года. Компания входит в реестр ЦБ РФ и имеет все необходимые лицензии для выдачи микрозаймов.'
  }
}

// Function to get MFO data from database
async function getMfoFromDb(slug: string): Promise<MfoData | null> {
  try {
    const result = await query(
      'SELECT * FROM mfo_companies WHERE LOWER(REPLACE(name, \' \', \'-\')) = LOWER($1) OR LOWER(REPLACE(name, \' \', \'\')) = LOWER($1)',
      [slug]
    )
    
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0]
      return {
        id: row.id,
        name: row.name,
        logo: row.logo || row.name.charAt(0),
        slug: slug,
        rating: parseFloat(row.rating) || 0,
        reviews: parseInt(row.reviews) || 0,
        sumMin: parseInt(row.sum_min) || 0,
        sumMax: parseInt(row.sum_max) || 0,
        termMin: parseInt(row.term_min) || 0,
        termMax: parseInt(row.term_max) || 0,
        percent: parseFloat(row.percent) || 0,
        firstFree: row.first_free || false,
        instant: row.instant || false,
        siteUrl: row.site_url,
        address: row.address,
        phone: row.phone,
        inn: row.inn,
        ogrn: row.ogrn,
        license: row.license
      }
    }
  } catch (error) {
    console.log('Database not available, using static data:', error)
  }
  return null
}

// Generate static params for all MFO
export async function generateStaticParams() {
  // Try to get from database first
  try {
    const result = await query('SELECT name FROM mfo_companies')
    if (result.rows && result.rows.length > 0) {
      return result.rows.map((row: { name: string }) => ({
        slug: row.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-я0-9-]/g, '')
      }))
    }
  } catch (error) {
    console.log('Using static params')
  }
  
  // Fallback to static data
  return Object.keys(staticMfoData).map((slug) => ({
    slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  // Try to get from database
  let mfo = await getMfoFromDb(slug)
  
  // Fallback to static data
  if (!mfo) {
    mfo = staticMfoData[slug] || null
  }
  
  if (!mfo) {
    return {
      title: 'МФО не найден',
      description: 'Страница не найдена'
    }
  }

  const currentYear = new Date().getFullYear()
  const title = `${mfo.name} - Взять микрозайм онлайн | Условия и отзывы ${currentYear}`
  const description = `Обзор МФО ${mfo.name}: взять займ от ${mfo.sumMin} до ${mfo.sumMax} рублей под ${mfo.percent}% в день. ${mfo.firstFree ? 'Первый займ 0%!' : ''} Отзывы, рейтинг ${mfo.rating}, условия ${currentYear} года.`
  
  return {
    title,
    description,
    keywords: `${mfo.name} микрозайм, ${mfo.name} займ на карту, ${mfo.name} отзывы, ${mfo.name} условия, займ ${mfo.name} онлайн`,
    openGraph: {
      title: `${mfo.name} - Обзор МФО и условия займа`,
      description: description.slice(0, 160),
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['ТвойСайт'],
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${mfo.name} - Микрозайм онлайн`,
      description: description.slice(0, 160),
    },
    alternates: {
      canonical: `https://твойсайт.рф/mfo/${slug}`
    }
  }
}

// Generate JSON-LD structured data for SEO
function generateJsonLd(mfo: MfoData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': `Займ в МФО ${mfo.name}`,
    'description': `Микрозайм от ${mfo.name}: сумма от ${mfo.sumMin} до ${mfo.sumMax} рублей, срок от ${mfo.termMin} до ${mfo.termMax} дней, ставка ${mfo.percent}% в день. ${mfo.firstFree ? 'Первый займ для новых клиентов - 0%!' : ''}`,
    'provider': {
      '@type': 'Organization',
      'name': mfo.name,
      'url': mfo.siteUrl || `https://твойсайт.рф/mfo/${mfo.slug}`,
      'address': mfo.address ? {
        '@type': 'PostalAddress',
        'addressLocality': mfo.address.split(',')[0]?.trim() || '',
        'addressRegion': 'Россия',
        'streetAddress': mfo.address
      } : undefined,
      'telephone': mfo.phone,
      'identifier': [
        ...(mfo.inn ? [{
          '@type': 'PropertyValue',
          'name': 'ИНН',
          'value': mfo.inn
        }] : []),
        ...(mfo.ogrn ? [{
          '@type': 'PropertyValue',
          'name': 'ОГРН',
          'value': mfo.ogrn
        }] : [])
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
      ...(mfo.license ? [{
        '@type': 'PropertyValue',
        'name': 'Лицензия ЦБ РФ',
        'value': mfo.license
      }] : [])
    ],
    'termsOfService': mfo.siteUrl,
    'category': 'https://schema.org/LoanOrCredit',
    'areaServed': {
      '@type': 'Country',
      'name': 'Россия'
    },
    'audience': {
      '@type': 'Audience',
      'audienceType': 'Физические лица, нуждающиеся в микрозайме'
    }
  }
}

export default async function MfoOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Try to get from database first
  let mfo = await getMfoFromDb(slug)
  
  // Fallback to static data
  if (!mfo) {
    mfo = staticMfoData[slug] || null
  }

  if (!mfo) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>МФО не найден</h1>
        <p style={{ color: '#666' }}>
          К сожалению, информация о данной микрофинансовой организации недоступна.
        </p>
        <a 
          href="/allmfo" 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            background: '#4caf50', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Перейти к списку всех МФО
        </a>
      </div>
    )
  }

  const jsonLd = generateJsonLd(mfo)

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Главная',
                'item': 'https://твойсайт.рф/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Все МФО',
                'item': 'https://твойсайт.рф/allmfo'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': mfo.name,
                'item': `https://твойсайт.рф/mfo/${slug}`
              }
            ]
          })
        }}
      />
      
      {/* Render the client component with MFO data */}
      <MfoOverviewClient mfo={mfo} />
    </>
  )
}
