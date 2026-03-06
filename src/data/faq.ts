import { useState, useEffect } from 'react'

export interface FAQ {
  id: number
  question: string
  answer: string
}

const initialFAQ: FAQ[] = [
  { id: 1, question: 'Как взять займ?', answer: 'Выберите сумму и срок на калькуляторе, заполните заявку и получите деньги на карту.' },
  { id: 2, question: 'Какие требования к заёмщику?', answer: 'Возраст от 18 лет, паспорт РФ, постоянная регистрация.' },
  { id: 3, question: 'Как погасить займ?', answer: 'Через личный кабинет МФО, банковским переводом или в терминале.' },
  { id: 4, question: 'Можно ли продлить займ?', answer: 'Да, большинство МФО предоставляют услугу пролонгации.' },
  { id: 5, question: 'Как влияет кредитная история?', answer: 'При плохой КИ шансы на одобрение ниже, но есть МФО с высоким процентом одобрения.' },
]

export const useFAQData = () => {
  const [faqData, setFaqData] = useState<FAQ[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных с сервера
  const fetchFAQ = async () => {
    try {
      const res = await fetch('/api/faq')
      if (res.ok) {
        const data = await res.json()
        setFaqData(data)
      } else {
        // Если сервер недоступен, используем статические данные
        setFaqData(initialFAQ)
        setError('Server unavailable, using static data')
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err)
      setFaqData(initialFAQ)
      setError('Connection failed, using static data')
    }
    setIsLoaded(true)
  }

  useEffect(() => {
    fetchFAQ()
  }, [])

  const addFAQ = async (faq: Omit<FAQ, 'id'>) => {
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      })
      if (res.ok) {
        const newFAQ = await res.json()
        setFaqData([...faqData, newFAQ])
      }
    } catch (err) {
      console.error('Error adding FAQ:', err)
    }
  }

  const updateFAQ = async (faq: FAQ) => {
    try {
      const res = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      })
      if (res.ok) {
        const updated = await res.json()
        setFaqData(faqData.map(f => f.id === faq.id ? updated : f))
      }
    } catch (err) {
      console.error('Error updating FAQ:', err)
    }
  }

  const deleteFAQ = async (id: number) => {
    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFaqData(faqData.filter(f => f.id !== id))
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err)
    }
  }

  const resetFAQ = () => {
    setFaqData(initialFAQ)
  }

  return { faqData, addFAQ, updateFAQ, deleteFAQ, resetFAQ, isLoaded, error, refetch: fetchFAQ }
}
