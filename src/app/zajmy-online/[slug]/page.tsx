import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, cities } from '@/data/cities'
import CityPageContent from './CityPageContent'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug)
  
  if (!city) {
    return { title: 'Займы онлайн' }
  }

  return {
    title: `Займы онлайн на карту в ${city.name} — быстрые микрозаймы без отказа`,
    description: `Получите займ ${city.nameGenitive}. Лучшие МФО с мгновенным одобрением и переводом на карту за 5 минут.`,
    openGraph: {
      title: `Займы в ${city.name} - получите деньги за 5 минут`,
      description: `Срочный займ на карту в ${city.name}. Мгновенное одобрение, первый займ 0%!`,
      type: 'website',
      url: `https://NewPay.ru/zajmy-online/${city.slug}`,
      siteName: 'NewPay',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Займы ${city.name}` }],
    },
  }
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    notFound()
  }

  return <CityPageContent city={city} />
}
