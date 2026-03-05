import { useState, useEffect } from 'react'
import { query } from '@/lib/db'

export interface MFO {
  id: number
  name: string
  logo: string
  slug?: string
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
  // Дополнительные поля для страницы обзора
  pros?: string[]
  cons?: string[]
  risks?: string[]
}

// Функция для получения данных из БД
const fetchMfoFromDb = async (): Promise<MFO[]> => {
  try {
    const res = await query('SELECT * FROM mfo_companies ORDER BY rating DESC')
    return res.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      rating: parseFloat(row.rating),
      reviews: row.reviews,
      sumMin: row.sum_min,
      sumMax: row.sum_max,
      termMin: row.term_min,
      termMax: row.term_max,
      percent: parseFloat(row.percent),
      firstFree: row.first_free,
      instant: row.instant,
      badge: row.badge,
      siteUrl: row.site_url,
      address: row.address,
      phone: row.phone,
      inn: row.inn,
      ogrn: row.ogrn,
      license: row.license,
      clicks: row.clicks,
      conversions: row.conversions,
    }))
  } catch (error) {
    console.error('Error fetching MFO from DB:', error)
    return []
  }
}

export const useMfoData = () => {
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных из БД при монтировании
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMfoFromDb()
      if (data.length > 0) {
        setMfoData(data)
      }
      setIsLoaded(true)
    }
    loadData()
  }, [])

  const addMfo = async (mfo: Omit<MFO, 'id'>) => {
    try {
      await query(
        `INSERT INTO mfo_companies 
         (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          mfo.name, mfo.logo, mfo.rating, mfo.reviews, mfo.sumMin, mfo.sumMax,
          mfo.termMin, mfo.termMax, mfo.percent, mfo.firstFree, mfo.instant,
          mfo.badge, mfo.siteUrl, mfo.address, mfo.phone, mfo.inn, mfo.ogrn, mfo.license
        ]
      )
      // Перезагружаем данные
      const data = await fetchMfoFromDb()
      setMfoData(data)
    } catch (err) {
      console.error('Error adding MFO:', err)
      setError('Ошибка при добавлении МФО')
    }
  }

  const updateMfo = async (mfo: MFO) => {
    try {
      await query(
        `UPDATE mfo_companies SET 
         name=$1, logo=$2, rating=$3, reviews=$4, sum_min=$5, sum_max=$6, 
         term_min=$7, term_max=$8, percent=$9, first_free=$10, instant=$11, 
         badge=$12, site_url=$13, address=$14, phone=$15, inn=$16, ogrn=$17, 
         license=$18, updated_at=CURRENT_TIMESTAMP 
         WHERE id=$19`,
        [
          mfo.name, mfo.logo, mfo.rating, mfo.reviews, mfo.sumMin, mfo.sumMax,
          mfo.termMin, mfo.termMax, mfo.percent, mfo.firstFree, mfo.instant,
          mfo.badge, mfo.siteUrl, mfo.address, mfo.phone, mfo.inn, mfo.ogrn,
          mfo.license, mfo.id
        ]
      )
      // Перезагружаем данные
      const data = await fetchMfoFromDb()
      setMfoData(data)
    } catch (err) {
      console.error('Error updating MFO:', err)
      setError('Ошибка при обновлении МФО')
    }
  }

  const deleteMfo = async (id: number) => {
    try {
      await query('DELETE FROM mfo_companies WHERE id=$1', [id])
      // Перезагружаем данные
      const data = await fetchMfoFromDb()
      setMfoData(data)
    } catch (err) {
      console.error('Error deleting MFO:', err)
      setError('Ошибка при удалении МФО')
    }
  }

  const resetData = async () => {
    // Удаляем все записи и вставляем начальные данные
    try {
      await query('DELETE FROM mfo_companies')
      
      const initialData = [
        { name: 'Екапуста', logo: 'Е', rating: 4.8, reviews: 45000, sumMin: 1000, sumMax: 30000, termMin: 5, termMax: 21, percent: 0.8, firstFree: true, instant: true, badge: 'Лучший выбор', siteUrl: 'https://ekapusta.com', address: 'г. Москва, ул. Ленина, 1', phone: '+7 (495) 123-45-67', inn: '7714010336', ogrn: '1127746672160', license: 'ЦБ РФ № 2120177001838' },
        { name: 'Займер', logo: 'З', rating: 4.7, reviews: 38000, sumMin: 2000, sumMax: 30000, termMin: 7, termMax: 30, percent: 1, firstFree: true, instant: true, badge: 'Без проверки', siteUrl: 'https://zaymer.ru', address: 'г. Москва, ул. Тверская, 10', phone: '+7 (495) 987-65-43', inn: '7702829787', ogrn: '1127746890521', license: 'ЦБ РФ № 2110177000409' },
        { name: 'MoneyMan', logo: 'M', rating: 4.6, reviews: 32000, sumMin: 1500, sumMax: 25000, termMin: 5, termMax: 30, percent: 0.9, firstFree: true, instant: true, badge: null, siteUrl: 'https://moneyman.ru', address: 'г. Санкт-Петербург, Невский пр., 50', phone: '+7 (812) 456-78-90', inn: '7842431531', ogrn: '1117847745361', license: 'ЦБ РФ № 2110177000191' },
        { name: 'Lime-zaim', logo: 'L', rating: 4.5, reviews: 28000, sumMin: 2000, sumMax: 20000, termMin: 10, termMax: 30, percent: 1, firstFree: false, instant: true, badge: 'С плохой КИ', siteUrl: 'https://lime-zaim.ru', address: 'г. Москва, ул. Пушкина, 25', phone: '+7 (495) 111-22-33', inn: '7703427466', ogrn: '1187746887729', license: 'ЦБ РФ № 1903550009325' },
        { name: 'Webbankir', logo: 'W', rating: 4.4, reviews: 22000, sumMin: 3000, sumMax: 30000, termMin: 7, termMax: 30, percent: 0.8, firstFree: true, instant: true, badge: null, siteUrl: 'https://webbankir.com', address: 'г. Москва, ул. Арбат, 15', phone: '+7 (495) 222-33-44', inn: '7702444160', ogrn: '1167746311620', license: 'ЦБ РФ № 2110177000187' },
        { name: 'Joy.money', logo: 'J', rating: 4.3, reviews: 18000, sumMin: 1000, sumMax: 25000, termMin: 5, termMax: 30, percent: 1, firstFree: true, instant: true, badge: null, siteUrl: 'https://joy.money', address: 'г. Москва, ул. Таганская, 20', phone: '+7 (495) 333-44-55', inn: '7703413904', ogrn: '1157746088152', license: 'ЦБ РФ № 2110177000783' },
        { name: 'CreditPlus', logo: 'C', rating: 4.2, reviews: 15000, sumMin: 2000, sumMax: 20000, termMin: 5, termMax: 25, percent: 0.9, firstFree: true, instant: true, badge: null, siteUrl: 'https://creditplus.ru', address: 'г. Москва, ул. Якиманка, 30', phone: '+7 (495) 444-55-66', inn: '7704035363', ogrn: '1157746758096', license: 'ЦБ РФ № 2110177000864' },
        { name: 'Pay P.S.', logo: 'P', rating: 4.1, reviews: 12000, sumMin: 1000, sumMax: 15000, termMin: 5, termMax: 20, percent: 1, firstFree: false, instant: true, badge: null, siteUrl: 'https://payps.ru', address: 'г. Москва, ул. Новый Арбат, 10', phone: '+7 (495) 555-66-77', inn: '7710942004', ogrn: '1147746872394', license: 'ЦБ РФ № 2110177000879' },
      ]

      for (const mfo of initialData) {
        await query(
          `INSERT INTO mfo_companies 
           (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [mfo.name, mfo.logo, mfo.rating, mfo.reviews, mfo.sumMin, mfo.sumMax, mfo.termMin, mfo.termMax, mfo.percent, mfo.firstFree, mfo.instant, mfo.badge, mfo.siteUrl, mfo.address, mfo.phone, mfo.inn, mfo.ogrn, mfo.license]
        )
      }

      // Перезагружаем данные
      const data = await fetchMfoFromDb()
      setMfoData(data)
    } catch (err) {
      console.error('Error resetting MFO:', err)
      setError('Ошибка при сбросе данных')
    }
  }

  return { mfoData, addMfo, updateMfo, deleteMfo, resetData, isLoaded, error }
}
