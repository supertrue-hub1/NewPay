import { useState, useEffect } from 'react'

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
  clicks?: number
  conversions?: number
  // JSON-LD Schema данные
  address?: string
  phone?: string
  inn?: string
  ogrn?: string
  license?: string
}

const initialMfo: MFO[] = [
  {
    id: 1,
    name: 'Екапуста',
    logo: 'Е',
    rating: 4.8,
    reviews: 45000,
    sumMin: 1000,
    sumMax: 30000,
    termMin: 5,
    termMax: 21,
    percent: 0.8,
    firstFree: true,
    instant: true,
    badge: 'Лучший выбор',
    siteUrl: 'https://ekapusta.com',
    address: 'г. Москва, ул. Ленина, 1',
    phone: '+7 (495) 123-45-67',
    inn: '7714010336',
    ogrn: '1127746672160',
    license: 'ЦБ РФ № 2120177001838',
  },
  {
    id: 2,
    name: 'Займер',
    logo: 'З',
    rating: 4.7,
    reviews: 38000,
    sumMin: 2000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 1,
    firstFree: true,
    instant: true,
    badge: 'Без проверки',
    siteUrl: 'https://zaymer.ru',
    address: 'г. Москва, ул. Тверская, 10',
    phone: '+7 (495) 987-65-43',
    inn: '7702829787',
    ogrn: '1127746890521',
    license: 'ЦБ РФ № 2110177000409',
  },
  {
    id: 3,
    name: 'MoneyMan',
    logo: 'M',
    rating: 4.6,
    reviews: 32000,
    sumMin: 1500,
    sumMax: 25000,
    termMin: 5,
    termMax: 30,
    percent: 0.9,
    firstFree: true,
    instant: true,
    siteUrl: 'https://moneyman.ru',
    address: 'г. Санкт-Петербург, Невский пр., 50',
    phone: '+7 (812) 456-78-90',
    inn: '7842431531',
    ogrn: '1117847745361',
    license: 'ЦБ РФ № 2110177000191',
  },
  {
    id: 4,
    name: 'Lime-zaim',
    logo: 'L',
    rating: 4.5,
    reviews: 28000,
    sumMin: 2000,
    sumMax: 20000,
    termMin: 10,
    termMax: 30,
    percent: 1,
    firstFree: false,
    instant: true,
    badge: 'С плохой КИ',
    siteUrl: 'https://lime-zaim.ru',
    address: 'г. Москва, ул. Пушкина, 25',
    phone: '+7 (495) 111-22-33',
    inn: '7703427466',
    ogrn: '1187746887729',
    license: 'ЦБ РФ № 1903550009325',
  },
  {
    id: 5,
    name: 'Webbankir',
    logo: 'W',
    rating: 4.4,
    reviews: 22000,
    sumMin: 3000,
    sumMax: 30000,
    termMin: 7,
    termMax: 30,
    percent: 0.8,
    firstFree: true,
    instant: true,
    siteUrl: 'https://webbankir.com',
    address: 'г. Москва, ул. Арбат, 15',
    phone: '+7 (495) 222-33-44',
    inn: '7702444160',
    ogrn: '1167746311620',
    license: 'ЦБ РФ № 2110177000187',
  },
  {
    id: 6,
    name: 'Joy.money',
    logo: 'J',
    rating: 4.3,
    reviews: 18000,
    sumMin: 1000,
    sumMax: 25000,
    termMin: 5,
    termMax: 30,
    percent: 1,
    firstFree: true,
    instant: true,
    siteUrl: 'https://joy.money',
    address: 'г. Москва, ул. Таганская, 20',
    phone: '+7 (495) 333-44-55',
    inn: '7703413904',
    ogrn: '1157746088152',
    license: 'ЦБ РФ № 2110177000783',
  },
  {
    id: 7,
    name: 'CreditPlus',
    logo: 'C',
    rating: 4.2,
    reviews: 15000,
    sumMin: 2000,
    sumMax: 20000,
    termMin: 5,
    termMax: 25,
    percent: 0.9,
    firstFree: true,
    instant: true,
    siteUrl: 'https://creditplus.ru',
    address: 'г. Москва, ул. Якиманка, 30',
    phone: '+7 (495) 444-55-66',
    inn: '7704035363',
    ogrn: '1157746758096',
    license: 'ЦБ РФ № 2110177000864',
  },
  {
    id: 8,
    name: 'Pay P.S.',
    logo: 'P',
    rating: 4.1,
    reviews: 12000,
    sumMin: 1000,
    sumMax: 15000,
    termMin: 5,
    termMax: 20,
    percent: 1,
    firstFree: false,
    instant: true,
    siteUrl: 'https://payps.ru',
    address: 'г. Москва, ул. Новый Арбат, 10',
    phone: '+7 (495) 555-66-77',
    inn: '7710942004',
    ogrn: '1147746872394',
    license: 'ЦБ РФ № 2110177000879',
  },
]

export const useMfoData = () => {
  const [mfoData, setMfoData] = useState<MFO[]>(initialMfo)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mfo')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setMfoData(parsed)
        } catch {
          setMfoData(initialMfo)
          localStorage.setItem('mfo', JSON.stringify(initialMfo))
        }
      } else {
        localStorage.setItem('mfo', JSON.stringify(initialMfo))
      }
      setIsLoaded(true)
    }
  }, [])

  const saveMfo = (mfo: MFO[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mfo', JSON.stringify(mfo))
    }
    setMfoData(mfo)
  }

  const addMfo = (mfo: Omit<MFO, 'id'>) => {
    const newMfo = { ...mfo, id: Date.now() }
    saveMfo([...mfoData, newMfo])
  }

  const updateMfo = (mfo: MFO) => {
    saveMfo(mfoData.map(m => m.id === mfo.id ? mfo : m))
  }

  const deleteMfo = (id: number) => {
    saveMfo(mfoData.filter(m => m.id !== id))
  }

  const resetData = () => {
    saveMfo(initialMfo)
  }

  return { mfoData, addMfo, updateMfo, deleteMfo, resetData, isLoaded }
}
