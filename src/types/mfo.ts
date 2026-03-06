// Типы данных для МФО (строгая типизация)
export interface MFO {
  id: number
  name: string
  logo: string
  rating: number
  reviews: number
  sumMin: number
  sumMax: number
  termMin: number
  termMax: number
  percent: number
  firstFree: boolean
  instant: boolean
  badge?: string
  siteUrl?: string
  infoModal?: string
  seoDescription?: string
  clicks?: number
  conversions?: number
  address?: string
  phone?: string
  inn?: string
  ogrn?: string
  license?: string
  createdAt?: Date
  updatedAt?: Date
}

// Тип для создания нового МФО
export type CreateMFO = Omit<MFO, 'id' | 'createdAt' | 'updatedAt'>

// Тип для обновления МФО
export type UpdateMFO = Partial<CreateMFO>

// Тип для ответа API
export interface MFOApiResponse {
  success: boolean
  data?: MFO[]
  error?: string
}
