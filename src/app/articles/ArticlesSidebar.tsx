'use client'

import Link from 'next/link'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'

// Получаем популярные статьи (по просмотрам)
function getPopularArticles(): StaticArticle[] {
  return [...staticArticles]
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .sort((a: StaticArticle, b: StaticArticle) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
}

// Получаем категории статей
function getCategories(): { name: string; count: number }[] {
  const categories: Record<string, number> = {}
  staticArticles
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .forEach((a: StaticArticle) => {
      categories[a.category] = (categories[a.category] || 0) + 1
    })
  return Object.entries(categories).map(([name, count]) => ({ name, count }))
}

export default function ArticlesSidebar() {
  const popularArticles = getPopularArticles()
  const categories = getCategories()

  return (
    <div className="space-y-6">
      {/* CTA Баннер - Срочно нужны деньги */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Срочно нужны деньги?</h3>
        <p className="text-gray-600 text-sm mb-4">Получите займ за 5 минут без проверки кредитной истории</p>
        <Link
          href="/allmfo"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
        >
          Получить деньги
        </Link>
      </div>

      {/* Категории */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          Рубрики
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/articles?category=${encodeURIComponent(cat.name)}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors group"
            >
              <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>
              <span className="bg-gray-100 group-hover:bg-indigo-100 text-gray-600 group-hover:text-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Популярные статьи */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Популярные статьи
        </h3>
        <div className="space-y-4">
          {popularArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block group"
            >
              <div className="flex gap-3">
                <span className="text-2xl font-bold text-indigo-200 group-hover:text-indigo-600 transition-colors">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {article.views?.toLocaleString() || 0}
                    </span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Рассылка */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Подписаться</h3>
        <p className="text-indigo-200 text-sm mb-4">Получайте новые статьи на email</p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Ваш email"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-indigo-400 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Подписаться
          </button>
        </div>
      </div>

      {/* МФО с лучшим рейтингом */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Топ МФО
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Екапуста', rating: 4.8, reviews: 45000 },
            { name: 'Займер', rating: 4.7, reviews: 38000 },
            { name: 'MoneyMan', rating: 4.6, reviews: 32000 },
            { name: 'Lime-zaim', rating: 4.5, reviews: 28000 }
          ].map((mfo) => (
            <Link
              key={mfo.name}
              href="/allmfo"
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {mfo.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {mfo.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-amber-500">★</span>
                <span className="font-semibold">{mfo.rating}</span>
                <span className="text-gray-400 text-xs">({mfo.reviews.toLocaleString()})</span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/allmfo"
          className="block text-center text-indigo-600 font-medium mt-4 hover:text-indigo-800 transition-colors"
        >
          Все МФО →
        </Link>
      </div>
    </div>
  )
}
