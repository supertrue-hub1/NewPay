'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image?: string
  category: string
  author: string
  status: string
  views: number
  reading_time: number
  tags?: string[]
  created_at?: string
  updated_at?: string
  published_at?: string
}

export const useArticlesFromDb = () => {
  const [articlesData, setArticlesData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/articles?page=1&limit=100')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Преобразуем данные из API в формат для админки
        const articles = result.data.map((article: any) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          cover_image: article.coverImage,
          category: article.category,
          author: article.author,
          status: article.status,
          views: article.views || 0,
          reading_time: article.readingTime || 5,
          tags: article.tags || [],
          created_at: article.createdAt,
          updated_at: article.updatedAt,
          published_at: article.publishedAt,
        }))
        setArticlesData(articles)
      }
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Не удалось загрузить статьи')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const addArticle = async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      })
      const result = await response.json()
      
      if (result.success) {
        await fetchArticles() // Перезагружаем список
        return true
      }
      return false
    } catch (err) {
      console.error('Error adding article:', err)
      return false
    }
  }

  const updateArticle = async (article: Article) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      })
      const result = await response.json()
      
      if (result.success) {
        await fetchArticles() // Перезагружаем список
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating article:', err)
      return false
    }
  }

  const deleteArticle = async (id: number) => {
    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        await fetchArticles() // Перезагружаем список
        return true
      }
      return false
    } catch (err) {
      console.error('Error deleting article:', err)
      return false
    }
  }

  const resetArticles = async () => {
    // Для сброса просто перезагружаем из БД
    await fetchArticles()
  }

  return { 
    articlesData, 
    loading, 
    error,
    addArticle, 
    updateArticle, 
    deleteArticle, 
    resetArticles,
    refreshArticles: fetchArticles
  }
}
