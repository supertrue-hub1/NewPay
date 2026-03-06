import { getSEOPageSlugs, getSEOPageConfig } from '@/lib/seo-pages-utils'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SEOContentAggregator from './SEOContentAggregator'
import SEOContentLanding from './SEOContentLanding'
import SEOContentArticle from './SEOContentArticle'

// Генерация всех путей при сборке
export async function generateStaticParams() {
  const slugs = getSEOPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Генерация метаданных для каждой страницы
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getSEOPageConfig(slug)
  
  if (!page) {
    return {
      title: 'Страница не найдена',
    }
  }
  
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getSEOPageConfig(slug)
  
  if (!page) {
    notFound()
  }
  
  // Рендер в зависимости от шаблона
  switch (page.template) {
    case 'aggregator':
      return <SEOContentAggregator data={page} />
    case 'landing':
      return <SEOContentLanding data={page} />
    case 'article':
      return <SEOContentArticle data={page} />
    default:
      return <SEOContentAggregator data={page} />
  }
}
