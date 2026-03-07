import { useState, useEffect, useCallback } from 'react'

export interface CreditCard {
  id: number
  name: string
  bank: string
  logo: string
  rating: number
  reviews: number
  cashback: number
  gracePeriod: number
  annualFee: number
  limit: number
  percent: number
  badge?: string
  features: string[]
  siteUrl?: string
}

// Хук работает ТОЛЬКО с БД через API
export const useCardsData = () => {
  const [cardsData, setCardsData] = useState<CreditCard[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных из API
  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch('/api/cards')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          const formattedData = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            bank: row.bank,
            logo: row.logo,
            rating: parseFloat(row.rating || 0),
            reviews: row.reviews || 0,
            cashback: row.cashback || 0,
            gracePeriod: row.grace_period || row.gracePeriod || 0,
            annualFee: row.annual_fee || row.annualFee || 0,
            limit: row.limit || 0,
            percent: parseFloat(row.percent || 0),
            badge: row.badge,
            features: row.features || [],
            siteUrl: row.site_url || row.siteUrl,
          }))
          setCardsData(formattedData)
        }
      }
    } catch (err) {
      console.error('Error loading cards:', err)
      setError('Ошибка при загрузке карт')
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  const addCard = async (card: Omit<CreditCard, 'id'>) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: card.name,
          bank: card.bank,
          logo: card.logo,
          rating: card.rating,
          reviews: card.reviews,
          cashback: card.cashback,
          grace_period: card.gracePeriod,
          annual_fee: card.annualFee,
          limit: card.limit,
          percent: card.percent,
          badge: card.badge,
          features: card.features,
          site_url: card.siteUrl,
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        fetchCards()
      }
    } catch (err) {
      console.error('Error adding card:', err)
      setError('Ошибка при добавлении карты')
    }
  }

  const updateCard = async (card: CreditCard) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: card.id,
          name: card.name,
          bank: card.bank,
          logo: card.logo,
          rating: card.rating,
          reviews: card.reviews,
          cashback: card.cashback,
          grace_period: card.gracePeriod,
          annual_fee: card.annualFee,
          limit: card.limit,
          percent: card.percent,
          badge: card.badge,
          features: card.features,
          site_url: card.siteUrl,
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        fetchCards()
      }
    } catch (err) {
      console.error('Error updating card:', err)
      setError('Ошибка при обновлении карты')
    }
  }

  const deleteCard = async (id: number) => {
    try {
      const res = await fetch(`/api/cards?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Удаляем из локального состояния
        setCardsData(prev => prev.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('Error deleting card:', err)
      setError('Ошибка при удалении карты')
    }
  }

  // Убрал resetCards - данные берутся только из БД

  return { cardsData, addCard, updateCard, deleteCard, isLoaded, error, refetch: fetchCards }
}
