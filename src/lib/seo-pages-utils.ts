/**
 * Утилиты для генерации SEO-страниц
 * Используется в generateStaticParams для Next.js App Router
 */

import { SEOPageConfig, generateAllPages, EXAMPLE_PAGES } from '@/data/seo-pages-config'

/**
 * Получить все slug для generateStaticParams
 * @param useExamples - использовать только примеры (для разработки)
 */
export function getSEOPageSlugs(useExamples: boolean = false): string[] {
  if (useExamples) {
    return EXAMPLE_PAGES.map(page => page.slug)
  }
  
  const allPages = generateAllPages()
  return allPages.map(page => page.slug)
}

/**
 * Получить конфигурацию страницы по slug
 */
export function getSEOPageConfig(slug: string): SEOPageConfig | undefined {
  // Сначала ищем в примерах
  const example = EXAMPLE_PAGES.find(p => p.slug === slug)
  if (example) return example
  
  // Если не найден, генерируем
  const allPages = generateAllPages()
  return allPages.find(p => p.slug === slug)
}

/**
 * Получить все страницы для карты сайта
 */
export function getAllSEOPages(): SEOPageConfig[] {
  return generateAllPages()
}

/**
 * Получить страницы по шаблону
 */
export function getPagesByTemplate(template: 'aggregator' | 'landing' | 'article'): SEOPageConfig[] {
  const allPages = generateAllPages()
  return allPages.filter(p => p.template === template)
}

/**
 * Получить статистику по шаблонам
 */
export function getTemplateStats(): Record<string, number> {
  const allPages = generateAllPages()
  
  return {
    total: allPages.length,
    aggregator: allPages.filter(p => p.template === 'aggregator').length,
    landing: allPages.filter(p => p.template === 'landing').length,
    article: allPages.filter(p => p.template === 'article').length,
  }
}

/**
 * Формат для generateStaticParams (App Router)
 */
export function getStaticParams() {
  const slugs = getSEOPageSlugs()
  return slugs.map(slug => ({ slug }))
}

/**
 * Формат для generateStaticParams с примерами (для разработки)
 */
export function getStaticParamsExamples() {
  const slugs = getSEOPageSlugs(true)
  return slugs.map(slug => ({ slug }))
}
