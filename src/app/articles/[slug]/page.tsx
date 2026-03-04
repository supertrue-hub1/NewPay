import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Article, ArticlesApiResponse } from '@/types/article'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'

// Функция для получения статьи по slug (статические данные)
function getArticle(slug: string): Article | null {
  const staticArticle = staticArticles.find((a: StaticArticle) => a.slug === slug)
  if (!staticArticle) return null

  return {
    id: staticArticle.id,
    slug: staticArticle.slug,
    title: staticArticle.title,
    excerpt: staticArticle.excerpt,
    content: staticArticle.content || staticArticle.excerpt,
    coverImage: staticArticle.image,
    category: staticArticle.category,
    author: staticArticle.author,
    status: staticArticle.status as 'DRAFT' | 'PUBLISHED',
    views: staticArticle.views || 0,
    readingTime: Math.ceil((staticArticle.content?.length || 200) / 1000),
    createdAt: new Date(staticArticle.date),
    updatedAt: new Date(staticArticle.date),
    publishedAt: new Date(staticArticle.date),
    tags: staticArticle.tags
  }
}

// Динамический роутинг - без статической генерации
export const dynamicParams = true

// Получение всех slug для статической генерации (упрощенная версия)
export async function generateStaticParams() {
  return []
}

// Динамические метаданные для SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) {
    return {
      title: 'Статья не найдена | NewPay'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const articleUrl = `${siteUrl}/articles/${slug}`

  return {
    title: `${article.title} | NewPay`,
    description: article.excerpt,
    keywords: [article.category, 'микрозаймы', 'кредиты', 'финансы', ...(article.tags || [])],
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      locale: 'ru_RU',
      url: articleUrl,
      siteName: 'NewPay',
      publishedTime: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: article.coverImage ? [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      creator: '@newpay'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: articleUrl
    }
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  // Статьи для related content
  const relatedArticles = staticArticles
    .filter((a: StaticArticle) => a.slug !== slug && a.status === 'PUBLISHED')
    .slice(0, 3)
    .map((a: StaticArticle) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      coverImage: a.image,
      views: a.views || 0
    }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-indigo-600 transition-colors">Статьи</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-indigo-100 mb-6">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-indigo-200">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {article.views.toLocaleString()} просмотров
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {article.readingTime} мин чтения
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="lg:w-2/3">
            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Теги:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/articles?tag=${encodeURIComponent(tag)}`}
                        className="bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-semibold text-gray-900 mb-4">Поделиться:</h4>
                <div className="flex gap-3">
                  <a
                    href={`https://vk.com/share.php?url=${siteUrl}/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ВКонтакте
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${siteUrl}/articles/${article.slug}&text=${article.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Telegram
                  </a>
                  <a
                    href={`https://ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=${siteUrl}/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Одноклассники
                  </a>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие статьи</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/articles/${related.slug}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      <div className="relative h-40 w-full overflow-hidden">
                        {related.coverImage ? (
                          <Image
                            src={related.coverImage}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">
                              {related.category.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-indigo-600 font-medium">{related.category}</span>
                        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Нужен займ?</h3>
                <p className="text-gray-600 text-sm mb-4">Получите деньги за 5 минут</p>
                <Link
                  href="/allmfo"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Выбрать МФО
                </Link>
              </div>

              {/* Popular Articles */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Популярное</h3>
                <div className="space-y-4">
                  {staticArticles
                    .filter((a: StaticArticle) => a.status === 'PUBLISHED' && a.slug !== slug)
                    .sort((a: StaticArticle, b: StaticArticle) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((a: StaticArticle) => (
                      <Link
                        key={a.id}
                        href={`/articles/${a.slug}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {a.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {a.views?.toLocaleString()} просмотров
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD Schema для статьи */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            image: article.coverImage,
            datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
            dateModified: article.updatedAt.toISOString(),
            author: {
              '@type': 'Person',
              name: article.author
            },
            publisher: {
              '@type': 'Organization',
              name: 'NewPay',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteUrl}/articles/${slug}`
            },
            articleSection: article.category,
            keywords: article.tags?.join(', '),
            wordCount: article.content.split(/\s+/).length,
            interactionStatistic: {
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/ReadAction',
              userInteractionCount: article.views
            }
          })
        }}
      />
    </div>
  )
}
