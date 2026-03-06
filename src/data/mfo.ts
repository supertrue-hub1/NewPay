import { useState, useEffect } from 'react'

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

export const useMfoData = () => {
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных из API при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/mfo')
        if (res.ok) {
          const data = await res.json()
          // Преобразование snake_case в camelCase если нужно
          const formattedData = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            logo: row.logo,
            slug: row.slug,
            rating: parseFloat(row.rating || row.rating || 0),
            reviews: row.reviews || 0,
            sumMin: row.sum_min || row.sumMin || 0,
            sumMax: row.sum_max || row.sumMax || 0,
            termMin: row.term_min || row.termMin || 0,
            termMax: row.term_max || row.termMax || 0,
            percent: parseFloat(row.percent || row.percent || 0),
            firstFree: row.first_free ?? row.firstFree ?? false,
            instant: row.instant ?? row.instant ?? false,
            badge: row.badge,
            siteUrl: row.site_url || row.siteUrl,
            address: row.address,
            phone: row.phone,
            inn: row.inn,
            ogrn: row.ogrn,
            license: row.license,
            infoModal: row.info_modal,
            clicks: row.clicks,
            conversions: row.conversions,
            pros: row.pros || [],
            cons: row.cons || [],
            risks: row.risks || [],
          }))
          setMfoData(formattedData)
        }
      } catch (err) {
        console.error('Error loading MFO:', err)
        setError('Ошибка при загрузке данных')
      }
      setIsLoaded(true)
    }
    loadData()
  }, [])

  const addMfo = async (mfo: Omit<MFO, 'id'>) => {
    try {
      const res = await fetch('/api/mfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mfo.name,
          logo: mfo.logo,
          rating: mfo.rating,
          reviews: mfo.reviews,
          sum_min: mfo.sumMin,
          sum_max: mfo.sumMax,
          term_min: mfo.termMin,
          term_max: mfo.termMax,
          percent: mfo.percent,
          first_free: mfo.firstFree,
          instant: mfo.instant,
          badge: mfo.badge,
          site_url: mfo.siteUrl,
          address: mfo.address,
          phone: mfo.phone,
          inn: mfo.inn,
          ogrn: mfo.ogrn,
          license: mfo.license,
          info_modal: mfo.infoModal,
          pros: mfo.pros || [],
          cons: mfo.cons || [],
          risks: mfo.risks || [],
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        const loadRes = await fetch('/api/mfo')
        if (loadRes.ok) {
          const data = await loadRes.json()
          const formattedData = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            logo: row.logo,
            slug: row.slug,
            rating: parseFloat(row.rating || 0),
            reviews: row.reviews || 0,
            sumMin: row.sum_min || 0,
            sumMax: row.sum_max || 0,
            termMin: row.term_min || 0,
            termMax: row.term_max || 0,
            percent: parseFloat(row.percent || 0),
            firstFree: row.first_free ?? false,
            instant: row.instant ?? false,
            badge: row.badge,
            siteUrl: row.site_url,
            address: row.address,
            phone: row.phone,
            inn: row.inn,
            ogrn: row.ogrn,
            license: row.license,
            infoModal: row.info_modal,
            pros: row.pros || [],
            cons: row.cons || [],
            risks: row.risks || [],
          }))
          setMfoData(formattedData)
        }
      }
    } catch (err) {
      console.error('Error adding MFO:', err)
      setError('Ошибка при добавлении МФО')
    }
  }

  const updateMfo = async (mfo: MFO) => {
    try {
      const res = await fetch('/api/mfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mfo.id,
          name: mfo.name,
          logo: mfo.logo,
          rating: mfo.rating,
          reviews: mfo.reviews,
          sum_min: mfo.sumMin,
          sum_max: mfo.sumMax,
          term_min: mfo.termMin,
          term_max: mfo.termMax,
          percent: mfo.percent,
          first_free: mfo.firstFree,
          instant: mfo.instant,
          badge: mfo.badge,
          site_url: mfo.siteUrl,
          address: mfo.address,
          phone: mfo.phone,
          inn: mfo.inn,
          ogrn: mfo.ogrn,
          license: mfo.license,
          info_modal: mfo.infoModal,
          pros: mfo.pros || [],
          cons: mfo.cons || [],
          risks: mfo.risks || [],
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        const loadRes = await fetch('/api/mfo')
        if (loadRes.ok) {
          const data = await loadRes.json()
          const formattedData = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            logo: row.logo,
            slug: row.slug,
            rating: parseFloat(row.rating || 0),
            reviews: row.reviews || 0,
            sumMin: row.sum_min || 0,
            sumMax: row.sum_max || 0,
            termMin: row.term_min || 0,
            termMax: row.term_max || 0,
            percent: parseFloat(row.percent || 0),
            firstFree: row.first_free ?? false,
            instant: row.instant ?? false,
            badge: row.badge,
            siteUrl: row.site_url,
            address: row.address,
            phone: row.phone,
            inn: row.inn,
            ogrn: row.ogrn,
            license: row.license,
            infoModal: row.info_modal,
            pros: row.pros || [],
            cons: row.cons || [],
            risks: row.risks || [],
          }))
          setMfoData(formattedData)
        }
      }
    } catch (err) {
      console.error('Error updating MFO:', err)
      setError('Ошибка при обновлении МФО')
    }
  }

  const deleteMfo = async (id: number) => {
    try {
      const res = await fetch(`/api/mfo?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Удаляем из локального состояния
        setMfoData(prev => prev.filter(m => m.id !== id))
      }
    } catch (err) {
      console.error('Error deleting MFO:', err)
      setError('Ошибка при удалении МФО')
    }
  }

  // Убрал resetData - теперь данные берутся только из БД
  // Удалённые карточки не восстанавливаются

  return { mfoData, addMfo, updateMfo, deleteMfo, isLoaded, error }
}
