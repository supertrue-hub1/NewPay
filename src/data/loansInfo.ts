'use client'

import { useState, useEffect } from 'react'

export interface LoansInfo {
  title: string
  content: string
  sections: {
    title: string
    content: string
  }[]
}

const defaultLoansInfo: LoansInfo = {
  title: 'Как получить займ онлайн?',
  content: 'Получение займа онлайн — это простой и быстрый процесс, который занимает всего несколько минут. Вам не нужно посещать офис МФО или собирать множество документов. Достаточно иметь паспорт и доступ к интернету.\n\nВыберите подходящую сумму и срок займа на нашем сайте, заполните короткую заявку и дождитесь решения. Большинство МФО одобряют заявки в течение 5-15 минут. После одобрения деньги будут переведены на вашу банковскую карту мгновенно.',
  sections: [
    {
      title: 'Требования к заемщикам',
      content: '• Гражданство РФ\n• Возраст от 18 до 70 лет\n• Постоянная регистрация\n• Наличие действующего паспорта\n• Доступ к банковской карте'
    },
    {
      title: 'Преимущества займов онлайн',
      content: '• Быстрое оформление за 5-15 минут\n• Минимальный пакет документов\n• Возможность получить деньги на карту\n• Первый займ под 0% для новых клиентов\n• Круглосуточная подача заявок'
    },
    {
      title: 'Как погасить займ?',
      content: 'Погасить займ можно несколькими способами:\n• Банковской картой на сайте МФО\n• Через личный кабинет банка\n• В терминалах оплаты\n• Наличными в офисе МФО\n\nРекомендуется погашать займ досрочно, чтобы избежать начисления процентов за весь срок.'
    },
    {
      title: 'Что делать при просрочке?',
      content: 'Если вы не можете вовремя погасить займ, свяжитесь с МФО как можно раньше. Большинство организаций предлагают:\n• Пролонгацию (продление срока займа)\n• Реструктуризацию долга\n• График поэтапного погашения\n\nВажно не допускать длительной просрочки, чтобы избежать штрафных санкций и ухудшения кредитной истории.'
    }
  ]
}

export const useLoansInfo = () => {
  const [loansInfo, setLoansInfo] = useState<LoansInfo>(defaultLoansInfo)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('loansInfo')
      if (stored) {
        try {
          setLoansInfo(JSON.parse(stored))
        } catch {
          setLoansInfo(defaultLoansInfo)
        }
      } else {
        localStorage.setItem('loansInfo', JSON.stringify(defaultLoansInfo))
      }
      setIsLoaded(true)
    }
  }, [])

  const saveLoansInfo = (data: LoansInfo) => {
    localStorage.setItem('loansInfo', JSON.stringify(data))
    setLoansInfo(data)
  }

  const updateLoansInfo = (data: Partial<LoansInfo>) => {
    saveLoansInfo({ ...loansInfo, ...data })
  }

  const resetLoansInfo = () => {
    saveLoansInfo(defaultLoansInfo)
  }

  return { loansInfo, updateLoansInfo, resetLoansInfo, isLoaded }
}
