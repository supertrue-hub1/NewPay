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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('faq')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setFaqData(parsed)
        } catch {
          setFaqData(initialFAQ)
          localStorage.setItem('faq', JSON.stringify(initialFAQ))
        }
      } else {
        setFaqData(initialFAQ)
        localStorage.setItem('faq', JSON.stringify(initialFAQ))
      }
      setIsLoaded(true)
    }
  }, [])

  const saveFAQ = (faq: FAQ[]) => {
    localStorage.setItem('faq', JSON.stringify(faq))
    setFaqData(faq)
  }

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFAQ = { ...faq, id: Date.now() }
    saveFAQ([...faqData, newFAQ])
  }

  const updateFAQ = (faq: FAQ) => {
    saveFAQ(faqData.map(f => f.id === faq.id ? faq : f))
  }

  const deleteFAQ = (id: number) => {
    saveFAQ(faqData.filter(f => f.id !== id))
  }

  const resetFAQ = () => {
    saveFAQ(initialFAQ)
  }

  return { faqData, addFAQ, updateFAQ, deleteFAQ, resetFAQ, isLoaded }
}
