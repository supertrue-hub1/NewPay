import { useState, useEffect, useCallback } from 'react'

interface PageData {
  about: {
    title: string
    content: string
    isHtml?: boolean
  }
  terms: {
    content: string
    isHtml?: boolean
  }
}

const defaultPageData: PageData = {
  about: {
    title: 'О нас',
    content: 'Сервис «Займы МФО» — это современная платформа для подбора микрозаймов от ведущих микрофинансовых организаций России. Мы помогаем пользователям быстро найти выгодные условия кредитования и оформить займ онлайн на карту.\n\nНаша миссия — сделать процесс получения займов максимально простым, прозрачным и безопасным. Мы сотрудничаем только с лицензированными МФО, которые прошли тщательную проверку и имеют положительную репутацию на рынке финансовых услуг.',
    isHtml: false
  },
  terms: {
    content: `Настоящее Пользовательское соглашение определяет порядок использования сервиса «Займы МФО» и отношения между Пользователем и Администрацией Сервиса.

1. Общие положения
1.1. Использование Сервиса означает согласие Пользователя с настоящим Соглашением.
1.2. Администрация оставляет за собой право вносить изменения в Соглашение.

2. Предмет соглашения
Сервис предоставляет информацию о микрофинансовых организациях и помогает Пользователю подобрать и оформить займ онлайн.

3. Ответственность
Администрация не несёт ответственности за решения, принятые Пользователем на основе информации, размещённой на Сервисе.`,
    isHtml: false
  }
}

export function usePageData() {
  const [pageData, setPageData] = useState<PageData>(defaultPageData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pageData')
      if (saved) {
        try {
          setPageData(JSON.parse(saved))
        } catch (e) {
          console.error('Error parsing pageData:', e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  const updatePageData = useCallback((newData: Partial<PageData>) => {
    setPageData(prev => {
      const updated = { ...prev, ...newData }
      if (typeof window !== 'undefined') {
        localStorage.setItem('pageData', JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const updateAbout = useCallback((data: { title: string; content: string; isHtml?: boolean }) => {
    updatePageData({ about: data })
  }, [updatePageData])

  const updateTerms = useCallback((data: { content: string; isHtml?: boolean }) => {
    updatePageData({ terms: data })
  }, [updatePageData])

  const resetPageData = useCallback(() => {
    setPageData(defaultPageData)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pageData')
    }
  }, [])

  return {
    pageData,
    isLoaded,
    updatePageData,
    updateAbout,
    updateTerms,
    resetPageData
  }
}
