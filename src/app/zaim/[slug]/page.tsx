import { generateAllPages, getPageBySlug } from '@/lib/seo-pages-generator'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SEOContent from './SEOContent'

// Генерация всех путей при сборке
export async function generateStaticParams() {
  const pages = generateAllPages()
  return pages.map((page) => ({ slug: page.slug }))
}

// Генерация метаданных для каждой страницы
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getPageBySlug(slug)
  
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
  const page = getPageBySlug(slug)
  
  if (!page) {
    notFound()
  }
  
  return <SEOContent data={page} />
}
