'use client'

import { useState } from 'react'
import { Box, Typography, Button, Chip } from '@mui/material'
import Link from 'next/link'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// Импорт статических данных статей
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'

// Тип статьи
interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  author: string
  views: number
  readingTime?: number
  featured?: boolean
}

// Преобразование статической статьи в формат компонента
const mapStaticArticle = (article: StaticArticle): Article => ({
  id: article.id,
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  category: article.category,
  author: article.author,
  views: article.views || 0,
  readingTime: 5,
  featured: article.id === 1,
})

// Все статьи (статические данные)
const allArticles: Article[] = staticArticles
  .filter(a => a.status === 'PUBLISHED')
  .map(mapStaticArticle)

// Категории с иконками и цветами
const CATEGORIES = [
  { id: 'all', label: 'Все', icon: '📚' },
  { id: 'Советы', label: 'Советы', icon: '💡' },
  { id: 'Безопасность', label: 'Предупреждения', icon: '⚠️' },
  { id: 'Сравнение', label: 'Аналитика', icon: '📊' },
  { id: 'Образование', label: 'Новости', icon: '📰' },
]

// Цвета для категорий
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Советы: { bg: '#d1fae5', text: '#047857', border: '#10b981' },
  Безопасность: { bg: '#fee2e2', text: '#b91c1c', border: '#ef4444' },
  Сравнение: { bg: '#dbeafe', text: '#1d4ed8', border: '#3b82f6' },
  Образование: { bg: '#cffafe', text: '#0e7490', border: '#06b6d4' },
}

function ArticleCard({ article }: { article: Article }) {
  const colors = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['Советы']

  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Box
        sx={{
          height: '100%',
          bgcolor: 'white',
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          borderLeft: `4px solid ${colors.border}`,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            '& .article-title': {
              color: '#059669',
            },
          },
        }}
      >
        <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Бейджи */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={article.category}
              size="small"
              sx={{
                bgcolor: colors.bg,
                color: colors.text,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
                borderRadius: '6px',
              }}
            />
            {article.featured && (
              <Chip
                label="Рекомендуем"
                size="small"
                sx={{
                  bgcolor: '#f59e0b',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22,
                  borderRadius: '6px',
                }}
              />
            )}
          </Box>

          {/* Заголовок */}
          <Typography
            className="article-title"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              color: '#111827',
              mb: 1,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.3s ease',
            }}
          >
            {article.title}
          </Typography>

          {/* Описание */}
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#6b7280',
              lineHeight: 1.5,
              mb: 2,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.excerpt}
          </Typography>

          {/* Автор и просмотры */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1.5,
            borderTop: '1px solid #f3f4f6'
          }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
              {article.author}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {typeof article.views === 'number' ? article.views.toLocaleString() : '0'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  )
}

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('all')

  // Фильтрация статей по категории
  const filteredArticles = activeCategory === 'all'
    ? allArticles
    : allArticles.filter(article => article.category === activeCategory)

  // Показываем только 8 статей
  const displayArticles = filteredArticles.slice(0, 8)

  return (
    <Box sx={{ mt: 10, mb: 6 }}>
      {/* Заголовок секции */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            color: '#111827',
            mb: 1,
          }}
        >
          Полезные статьи
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '1rem' }}>
          Узнайте, как выбрать лучший займ и не попасть в неприятности
        </Typography>
      </Box>

      {/* Фильтры по категориям */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        justifyContent: 'center',
        mb: 4 
      }}>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            variant={activeCategory === cat.id ? 'contained' : 'outlined'}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 2.5,
              py: 0.75,
              borderRadius: '50px',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#e5e7eb',
              color: activeCategory === cat.id ? 'white' : '#4b5563',
              bgcolor: activeCategory === cat.id ? '#111827' : 'transparent',
              '&:hover': {
                bgcolor: activeCategory === cat.id ? '#1f2937' : '#f3f4f6',
                borderColor: activeCategory === cat.id ? '#111827' : '#d1d5db',
              },
            }}
          >
            <span style={{ fontSize: 14 }}>{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </Box>

      {/* Сетка статей */}
      {displayArticles.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#6b7280' }}>
            Статьи не найдены
          </Typography>
        </Box>
      )}

      {/* Ссылка на все статьи */}
      {displayArticles.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={Link}
            href="/articles"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#10b981',
              color: '#10b981',
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: '50px',
              '&:hover': {
                bgcolor: '#ecfdf5',
                borderColor: '#059669',
              },
            }}
          >
            Все статьи
          </Button>
        </Box>
      )}
    </Box>
  )
}
