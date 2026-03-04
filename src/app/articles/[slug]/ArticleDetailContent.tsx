'use client'

import { useParams } from 'next/navigation'
import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button, Breadcrumbs, Link } from '@mui/material'
import LinkNext from 'next/link'
import { useState } from 'react'
import { articlesData } from '@/data/articles-data'

export default function ArticleDetailContent({ slug }: { slug: string }) {
  const article = articlesData.find(a => a.slug === slug)
  const [imageError, setImageError] = useState(false)

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4">Статья не найдена</Typography>
        <Button component={LinkNext} href="/articles" sx={{ mt: 2 }}>Вернуться к списку</Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={LinkNext} href="/" color="inherit">Главная</Link>
        <Link component={LinkNext} href="/articles" color="inherit">Статьи</Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>

      {/* Герой-статья */}
      <Card sx={{ mb: 4, overflow: 'hidden' }}>
        {article.image && !imageError ? (
          <Box
            component="img"
            src={
              article.image.startsWith('data:') ? article.image :
              article.image.startsWith('http') ? article.image :
              `/images/${article.image}`
            }
            alt={article.title}
            sx={{ width: '100%', height: 300, objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box sx={{ 
            height: 300, 
            bgcolor: '#1a237e', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '4rem',
            fontWeight: 800
          }}>
            {article.category.charAt(0)}
          </Box>
        )}
        <CardContent sx={{ p: 3 }}>
          <Chip label={article.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
            {article.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Автор: {article.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(article.date).toLocaleDateString('ru-RU')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              👁 {article.views?.toLocaleString() || 0} просмотров
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Контент статьи */}
      <Card sx={{ p: 4 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
          {article.content}
        </Typography>
      </Card>

      {/* Навигация */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button component={LinkNext} href="/articles" variant="outlined">
          ← К списку статей
        </Button>
      </Box>
    </Container>
  )
}
