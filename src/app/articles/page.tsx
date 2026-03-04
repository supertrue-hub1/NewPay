import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Article, ArticlesApiResponse } from '@/types/article'
import { MFO } from '@/types/mfo'
import ArticlesGrid from './ArticlesGrid'
import ArticlesSidebar from './ArticlesSidebar'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'

// Функция для получения статей (сначала из API, потом статические)
async function getArticles(page: number = 1, limit: number = 9): Promise<{
  articles: Article[]
  featured: Article | null
  total: number
  totalPages: number
}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/articles?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (response.ok) {
      const data: ArticlesApiResponse = await response.json()
      return {
        articles: data.data || [],
        featured: data.featured || null,
        total: data.total || 0,
        totalPages: data.totalPages || 1
      }
    }
  } catch (error) {
    console.log('API not available, using static data')
  }
  
  // Fallback to static data
  const articles: Article[] = staticArticles
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .map((a: StaticArticle) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content || a.excerpt,
      coverImage: a.image,
      category: a.category,
      author: a.author,
      status: a.status as 'DRAFT' | 'PUBLISHED',
      views: a.views || 0,
      readingTime: Math.ceil((a.content?.length || 200) / 1000),
      createdAt: new Date(a.date),
      updatedAt: new Date(a.date),
      publishedAt: new Date(a.date),
      tags: a.tags
    }))

  const featured = articles.length > 0 ? articles[0] : null
  const paginatedArticles = articles.slice((page - 1) * limit, page * limit)
  
  return {
    articles: paginatedArticles,
    featured,
    total: articles.length,
    totalPages: Math.ceil(articles.length / limit)
  }
}

// SEO метаданные для страницы статей
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Статьи о займах и финансах | NewPay',
    description: 'Полезные статьи о микрозаймах, кредитах, управлении личными финансами и повышении кредитного рейтинга. Экспертные материалы от NewPay.',
    keywords: ['статьи о займах', 'финансовые статьи', 'кредитный рейтинг', 'личные финансы', 'микрозаймы'],
    openGraph: {
      title: 'Статьи о займах и финансах | NewPay',
      description: 'Полезные статьи о микрозаймах, кредитах и управлении личными финансами.',
      type: 'website',
      locale: 'ru_RU',
      siteName: 'NewPay'
    },
    twitter: {
      card: 'summary',
      title: 'Статьи о займах и финансах | NewPay',
      description: 'Полезные статьи о микрозаймах и кредитах.'
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const { articles, featured, total, totalPages } = await getArticles(page)

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Статьи о займах и финансах</h1>
          <p className="text-gray-600">Статьи скоро появятся...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Статьи о займах и финансах</h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Полезные материалы о микрозаймах, кредитных картах и управлении личными финансами
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Основной контент */}
          <div className="lg:w-2/3">
            {/* Featured Article - Герой дня */}
            {featured && page === 1 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-indigo-600 rounded"></span>
                  Герой дня
                </h2>
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <Link href={`/articles/${featured.slug}`} className="block">
                    <div className="relative h-64 md:h-80 w-full overflow-hidden">
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-6xl font-bold text-white">
                            {featured.category.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          {featured.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {featured.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          {featured.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {featured.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {featured.readingTime} мин
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              </section>
            )}

            {/* Articles Grid - Сетка статей */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded"></span>
                Все статьи
              </h2>
              <ArticlesGrid 
                articles={page === 1 && featured ? articles.slice(1) : articles} 
              />
            </section>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/articles?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-indigo-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Сайдбар */}
          <aside className="lg:w-1/3">
            <ArticlesSidebar />
          </aside>
        </div>
      </div>

      {/* JSON-LD Schema для статей */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Статьи о займах и финансах',
            description: 'Полезные статьи о микрозаймах и кредитах',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: articles.map((article, index) => ({
                '@type': 'Article',
                position: index + 1,
                headline: article.title,
                description: article.excerpt,
                image: article.coverImage,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/articles/${article.slug}`,
                datePublished: article.publishedAt || article.createdAt,
                author: {
                  '@type': 'Person',
                  name: article.author
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}
