import { useState, useEffect } from 'react'

export interface PromoCode {
  id: number
  mfoName: string
  logo: string
  promoCode: string
  discount: string
  conditions: string
  siteUrl: string
  isExclusive?: boolean
}

const initialPromoCodes: PromoCode[] = [
  {
    id: 1,
    mfoName: 'Екапуста',
    logo: 'Е',
    promoCode: 'NewPay',
    discount: 'До 15% скидка',
    conditions: 'При первом займе от 5000 ₽. Скидка автоматически применяется при переходе.',
    siteUrl: 'https://ekapusta.com',
    isExclusive: true,
  },
  {
    id: 2,
    mfoName: 'Займер',
    logo: 'З',
    promoCode: 'SRAVNI10',
    discount: '10% скидка',
    conditions: 'На первый займ. Промокод не требуется - скидка применяется автоматически.',
    siteUrl: 'https://zaymer.ru',
  },
  {
    id: 3,
    mfoName: 'MoneyMan',
    logo: 'M',
    promoCode: 'MONEY100',
    discount: '100 ₽ бесплатно',
    conditions: 'При регистрации. Бонус зачисляется автоматически на первый займ.',
    siteUrl: 'https://moneyman.ru',
  },
  {
    id: 4,
    mfoName: 'Lime-zaim',
    logo: 'L',
    promoCode: 'LIME500',
    discount: '500 ₽ в подарок',
    conditions: 'Новым клиентам при первом займе от 8000 ₽.',
    siteUrl: 'https://lime-zaim.ru',
  },
  {
    id: 5,
    mfoName: 'Webbankir',
    logo: 'W',
    promoCode: '',
    discount: '0% первый займ',
    conditions: 'Для новых клиентов - первый займ до 30 дней без процентов!',
    siteUrl: 'https://webbankir.com',
    isExclusive: true,
  },
  {
    id: 6,
    mfoName: 'Быстроденьги',
    logo: 'Б',
    promoCode: 'SPEED200',
    discount: '200 ₽ на баланс',
    conditions: 'За регистрацию. Бонус можно использовать для погашения займа.',
    siteUrl: 'https://bistrodeneg.ru',
  },
  {
    id: 7,
    mfoName: 'Турбозайм',
    logo: 'Т',
    promoCode: 'TURBO15',
    discount: '15% скидка',
    conditions: 'На все последующие займы. Действует при продлении.',
    siteUrl: 'https://turbocredit.ru',
  },
  {
    id: 8,
    mfoName: 'Конга',
    logo: 'К',
    promoCode: 'KONGA50',
    discount: '50% скидка на проценты',
    conditions: 'При досрочном погашении. Сэкономьте на процентах!',
    siteUrl: 'https://konga.ru',
  },
]

export const usePromoCodesData = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('promokody')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setPromoCodes(parsed)
        } catch {
          setPromoCodes(initialPromoCodes)
          localStorage.setItem('promokody', JSON.stringify(initialPromoCodes))
        }
      } else {
        localStorage.setItem('promokody', JSON.stringify(initialPromoCodes))
      }
      setIsLoaded(true)
    }
  }, [])

  const savePromoCodes = (data: PromoCode[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promokody', JSON.stringify(data))
    }
    setPromoCodes(data)
  }

  const addPromoCode = (promo: Omit<PromoCode, 'id'>) => {
    const newPromo = { ...promo, id: Date.now() }
    savePromoCodes([...promoCodes, newPromo])
  }

  const updatePromoCode = (promo: PromoCode) => {
    savePromoCodes(promoCodes.map(p => p.id === promo.id ? promo : p))
  }

  const deletePromoCode = (id: number) => {
    savePromoCodes(promoCodes.filter(p => p.id !== id))
  }

  const resetPromoCodes = () => {
    savePromoCodes(initialPromoCodes)
  }

  return { promoCodes, addPromoCode, updatePromoCode, deletePromoCode, resetPromoCodes, isLoaded }
}
