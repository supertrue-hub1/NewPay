import { useState, useEffect } from 'react'

/**
 * Хук для безопасной работы с localStorage при SSR
 * Предотвращает ошибки гидратации
 */
export function useHydrationSafe<T>(key: string, initialValue: T): [T, boolean] {
  const [data, setData] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          setData(JSON.parse(stored))
        } catch {
          // используем initialValue при ошибке парсинга
        }
      }
      setIsLoaded(true)
    }
  }, [key])

  return [data, isLoaded]
}

/**
 * Хук для проверки, что компонент смонтирован на клиенте
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
