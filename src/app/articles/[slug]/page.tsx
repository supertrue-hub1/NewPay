import { Metadata } from 'next'
import ArticleDetailContent from './ArticleDetailContent'
import { articlesData } from '@/data/articles-data'

// ISR: обновление страницы каждый час
export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateStaticParams() {
  return articlesData.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = articlesData.find(a => a.slug === slug)
  
  if (!article) {
    return { title: 'Статья не найдена' }
  }

  return {
    title: `${article.title} | NewPay`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `https://NewPay.ru/articles/${article.slug}`,
      siteName: 'NewPay',
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : [],
    },
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleDetailContent slug={slug} />
}
