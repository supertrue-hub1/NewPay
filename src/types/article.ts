// Типы для статей (строгая типизация)
export type ArticleStatus = 'DRAFT' | 'PUBLISHED'

export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  category: string
  author: string
  authorId?: number
  status: ArticleStatus
  views: number
  readingTime: number // в минутах
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  tags?: string[]
}

// Тип для создания статьи
export type CreateArticle = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>

// Тип для обновления статьи  
export type UpdateArticle = Partial<CreateArticle>

// Тип для ответа API
export interface ArticlesApiResponse {
  success: boolean
  data?: Article[]
  featured?: Article
  total?: number
  page?: number
  totalPages?: number
  error?: string
}

// Тип для метаданных статьи (SEO)
export interface ArticleMetadata {
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary_large_image'
  twitterTitle: string
  twitterDescription: string
  twitterImage?: string
  canonical?: string
}
