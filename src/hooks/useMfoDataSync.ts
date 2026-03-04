// Хук для получения данных МФО с синхронизацией localStorage, БД и сервера
'use client'

import { useState, useEffect } from 'react'
import { MFO } from '@/data/mfo'

const STORAGE_KEY = 'NewPay_mfo_data'

export function useMfoDataSync() {
  const [mfoData, setMfoData] = useState<MFO[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [useDatabase, setUseDatabase] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      // 1. Пробуем загрузить из PostgreSQL базы данных
      try {
        const response = await fetch('/api/mfo')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            // Конвертируем snake_case в camelCase для совместимости
            const convertedData = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              logo: item.logo,
              rating: parseFloat(item.rating),
              reviews: item.reviews,
              sumMin: item.sum_min,
              sumMax: item.sum_max,
              termMin: item.term_min,
              termMax: item.term_max,
              percent: parseFloat(item.percent),
              firstFree: item.first_free,
              instant: item.instant,
              badge: item.badge,
              siteUrl: item.site_url,
              address: item.address,
              phone: item.phone,
              inn: item.inn,
              ogrn: item.ogrn,
              license: item.license,
              clicks: item.clicks,
              conversions: item.conversions,
            }))
            setMfoData(convertedData)
            setUseDatabase(true)
            // Кешируем в localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
            }
            setIsLoaded(true)
            return
          }
        }
      } catch (e) {
        console.log('Database not available, trying other sources:', e)
      }

      // 2. Пробуем загрузить из localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.length > 0) {
              setMfoData(parsed)
              setIsLoaded(true)
              return
            }
          } catch (e) {
            console.error('Error parsing localStorage:', e)
          }
        }
      }

      // 3. Загружаем с сервера/API (старый метод)
      try {
        const response = await fetch('/api/data?type=mfo')
        if (response.ok) {
          const data = await response.json()
          setMfoData(data)
          // Кешируем в localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e)
      }

      setIsLoaded(true)
    }

    loadData()
  }, [])

  const saveData = async (data: MFO[]) => {
    setMfoData(data)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    // Если используем БД, синхронизируем изменения
    if (useDatabase) {
      try {
        // Удаляем все и добавляем заново (простая синхронизация)
        for (const item of data) {
          await fetch('/api/mfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.name,
              logo: item.logo,
              rating: item.rating,
              reviews: item.reviews,
              sum_min: item.sumMin,
              sum_max: item.sumMax,
              term_min: item.termMin,
              term_max: item.termMax,
              percent: item.percent,
              first_free: item.firstFree,
              instant: item.instant,
              badge: item.badge,
              site_url: item.siteUrl,
              address: item.address,
              phone: item.phone,
              inn: item.inn,
              ogrn: item.ogrn,
              license: item.license,
            }),
          })
        }
      } catch (e) {
        console.error('Error syncing to database:', e)
      }
    }
  }

  const addItem = async (item: Omit<MFO, 'id'>) => {
    const newItem = { ...item, id: Date.now() }
    const newData = [...mfoData, newItem]
    await saveData(newData)
    return newItem
  }

  const updateItem = async (id: number, item: Partial<MFO>) => {
    const newData = mfoData.map(m => m.id === id ? { ...m, ...item } : m)
    await saveData(newData)
  }

  const deleteItem = async (id: number) => {
    const newData = mfoData.filter(m => m.id !== id)
    await saveData(newData)
  }

  return { mfoData, isLoaded, addItem, updateItem, deleteItem, saveData, useDatabase }
}
