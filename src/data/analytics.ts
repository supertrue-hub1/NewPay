import { useState } from 'react'

export interface Analytics {
  mfoClicks: Record<number, number>
  mfoConversions: Record<number, number>
  popularFilters: {
    sumRanges: Record<string, number>
    termRanges: Record<string, number>
  }
  totalViews: number
  totalApplications: number
}

const defaultAnalytics: Analytics = {
  mfoClicks: {},
  mfoConversions: {},
  popularFilters: {
    sumRanges: {},
    termRanges: {}
  },
  totalViews: 0,
  totalApplications: 0
}

export const useAnalytics = () => {
  const getAnalytics = (): Analytics => {
    if (typeof window === 'undefined') return defaultAnalytics
    const stored = localStorage.getItem('analytics')
    if (stored) return JSON.parse(stored)
    localStorage.setItem('analytics', JSON.stringify(defaultAnalytics))
    return defaultAnalytics
  }

  const [analytics, setAnalytics] = useState<Analytics>(getAnalytics)

  const saveAnalytics = (data: Analytics) => {
    localStorage.setItem('analytics', JSON.stringify(data))
    setAnalytics(data)
  }

  const trackMfoClick = (mfoId: number) => {
    const newData = {
      ...analytics,
      mfoClicks: {
        ...analytics.mfoClicks,
        [mfoId]: (analytics.mfoClicks[mfoId] || 0) + 1
      },
      totalViews: analytics.totalViews + 1
    }
    saveAnalytics(newData)
  }

  const trackConversion = (mfoId: number) => {
    const newData = {
      ...analytics,
      mfoConversions: {
        ...analytics.mfoConversions,
        [mfoId]: (analytics.mfoConversions[mfoId] || 0) + 1
      },
      totalApplications: analytics.totalApplications + 1
    }
    saveAnalytics(newData)
  }

  const trackFilter = (type: 'sum' | 'term', value: string) => {
    const key = type === 'sum' ? 'sumRanges' : 'termRanges'
    const newData = {
      ...analytics,
      popularFilters: {
        ...analytics.popularFilters,
        [key]: {
          ...analytics.popularFilters[key],
          [value]: (analytics.popularFilters[key][value] || 0) + 1
        }
      }
    }
    saveAnalytics(newData)
  }

  const getConversionRate = (mfoId: number): number => {
    const clicks = analytics.mfoClicks[mfoId] || 0
    const conversions = analytics.mfoConversions[mfoId] || 0
    if (clicks === 0) return 0
    return Math.round((conversions / clicks) * 100)
  }

  const resetAnalytics = () => {
    saveAnalytics(defaultAnalytics)
  }

  return { 
    analytics, 
    trackMfoClick, 
    trackConversion, 
    trackFilter, 
    getConversionRate,
    resetAnalytics 
  }
}
