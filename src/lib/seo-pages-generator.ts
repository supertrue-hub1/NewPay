// Генератор SEO-страниц для займов
import { clientTypes, purposes, features, amounts, SEOClientType, SEOPurpose, SEOFeature, SEOAmount } from '@/data/seo-credits'

export interface SEOPage {
  slug: string
  h1: string
  title: string
  description: string
  keywords: string[]
  clientType: string
  purpose: string
  feature: string
  amount: string
}

function generateSlug(client: SEOClientType, purpose: SEOPurpose, feature: SEOFeature, amount: SEOAmount): string {
  return `zaim-${purpose.slug}-${feature.slug}-${client.slug}-${amount.slug}`
}

function generateH1(client: SEOClientType, purpose: SEOPurpose, feature: SEOFeature, amount: SEOAmount): string {
  const lsi = client.lsi[Math.floor(Math.random() * client.lsi.length)]
  return `Займ ${purpose.name.toLowerCase()} для ${lsi} ${feature.name.toLowerCase()} на сумму ${amount.name}`
}

function generateTitle(client: SEOClientType, purpose: SEOPurpose, feature: SEOFeature, amount: SEOAmount): string {
  const purposeLSI = purpose.lsi[0]
  const clientLSI = client.lsi[0]
  return `Взять займ ${purposeLSI} ${clientLSI} ${feature.name.toLowerCase()} онлайн | ТОП предложений ${amount.name}`
}

function generateDescription(client: SEOClientType, purpose: SEOPurpose, feature: SEOFeature, amount: SEOAmount): string {
  const purposeLSI = purpose.lsi[0]
  const clientLSI = client.lsi[0]
  return `Срочные займы ${purposeLSI} для ${clientLSI} ${feature.name.toLowerCase()}. Деньги на карту за 5 минут. Оформите заявку прямо сейчас!`
}

function generateKeywords(client: SEOClientType, purpose: SEOPurpose, feature: SEOFeature): string[] {
  return [
    `займ ${purpose.lsi[0]}`,
    `${client.lsi[0]} ${feature.lsi[0]}`,
    `микрозайм ${client.lsi[0]}`,
    `деньги в долг ${purpose.lsi[0]}`,
    `ссуда ${feature.lsi[0]}`,
  ]
}

export function generateAllPages(): SEOPage[] {
  const pages: SEOPage[] = []
  
  for (const client of clientTypes) {
    for (const purpose of purposes) {
      for (const feature of features) {
        for (const amount of amounts) {
          pages.push({
            slug: generateSlug(client, purpose, feature, amount),
            h1: generateH1(client, purpose, feature, amount),
            title: generateTitle(client, purpose, feature, amount),
            description: generateDescription(client, purpose, feature, amount),
            keywords: generateKeywords(client, purpose, feature),
            clientType: client.id,
            purpose: purpose.id,
            feature: feature.id,
            amount: amount.id,
          })
        }
      }
    }
  }
  
  // Ограничиваем до 1000 страниц
  return pages.slice(0, 1000)
}

// Получить страницу по слагу
export function getPageBySlug(slug: string): SEOPage | undefined {
  const pages = generateAllPages()
  return pages.find(p => p.slug === slug)
}
