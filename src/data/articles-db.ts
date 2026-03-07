'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Article {
  id?: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date?: string
  category: string
  image?: string
  views?: number
  seoTitle?: string
  seoDescription?: string
  seoOgImage?: string
}

export const useArticlesDb = () => {
  const [articlesData, setArticlesData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка статей с сервера
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Преобразуем данные из БД в формат для админки
        const articles = result.data.map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          content: a.content,
          author: a.author,
          date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: a.category,
          image: a.coverImage,
          views: a.views,
          seoTitle: a.title,
          seoDescription: a.excerpt,
          seoOgImage: a.coverImage
        }))
        setArticlesData(articles)
      } else {
        // Если нет в БД, пробуем загрузить из localStorage как резерв
        const stored = localStorage.getItem('articles')
        if (stored) {
          try {
            setArticlesData(JSON.parse(stored))
          } catch {
            setArticlesData([])
          }
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles')
      // Резерв - localStorage
      const stored = localStorage.getItem('articles')
      if (stored) {
        try {
          setArticlesData(JSON.parse(stored))
        } catch {
          setArticlesData([])
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Добавить статью в БД
  const addArticle = async (article: Omit<Article, 'id'>) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          cover_image: article.image,
          category: article.category,
          author: article.author,
          status: 'PUBLISHED',
          views: 0,
          reading_time: Math.ceil((article.content?.length || 200) / 1000),
          tags: article.category
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Обновляем локальный список
        await fetchArticles()
        // Также сохраняем в localStorage как бэкап
        localStorage.setItem('articles', JSON.stringify(articlesData))
        return result.data
      } else {
        throw new Error(result.error || 'Failed to add article')
      }
    } catch (err) {
      console.error('Error adding article:', err)
      // Резервное добавление в localStorage
      const newArticle = { ...article, id: Date.now() }
      const updated = [...articlesData, newArticle]
      setArticlesData(updated)
      localStorage.setItem('articles', JSON.stringify(updated))
      return newArticle
    }
  }

  // Обновить статью в БД
  const updateArticle = async (article: Article) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          cover_image: article.image,
          category: article.category,
          author: article.author,
          status: 'PUBLISHED',
          views: article.views,
          reading_time: Math.ceil((article.content?.length || 200) / 1000),
          tags: article.category
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchArticles()
        return result.data
      } else {
        throw new Error(result.error || 'Failed to update article')
      }
    } catch (err) {
      console.error('Error updating article:', err)
      // Резервное обновление в localStorage
      const updated = articlesData.map(a => a.id === article.id ? article : a)
      setArticlesData(updated)
      localStorage.setItem('articles', JSON.stringify(updated))
      return article
    }
  }

  // Удалить статью из БД
  const deleteArticle = async (id: number) => {
    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchArticles()
        return true
      } else {
        throw new Error(result.error || 'Failed to delete article')
      }
    } catch (err) {
      console.error('Error deleting article:', err)
      // Резервное удаление из localStorage
      const updated = articlesData.filter(a => a.id !== id)
      setArticlesData(updated)
      localStorage.setItem('articles', JSON.stringify(updated))
      return true
    }
  }

  // Сброс - только очищает localStorage
  const resetArticles = () => {
    localStorage.removeItem('articles')
    fetchArticles()
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
