'use client'

import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button } from '@mui/material'
import LinkNext from 'next/link'
import { useState } from 'react'
import { articlesData } from '@/data/articles-data'

export default function ArticlesContent() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const heroArticle = articlesData[0]
  const otherArticles = articlesData.slice(1)

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Основная колонка */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
              Статьи о займах и финансах
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Полезные материалы о микрозаймах, кредитных картах и управлении личными финансами
            </Typography>

            {/* Герой-статья */}
            {heroArticle && (
              <Card sx={{ mb: 4, overflow: 'hidden' }}>
                {heroArticle.image && !imageErrors[heroArticle.id] ? (
                  <Box
                    component="img"
                    src={
                      heroArticle.image.startsWith('data:') ? heroArticle.image :
                      heroArticle.image.startsWith('http') ? heroArticle.image :
                      `/images/${heroArticle.image}`
                    }
                    alt={heroArticle.title}
                    sx={{ width: '100%', height: 250, objectFit: 'cover' }}
                    onError={() => setImageErrors(prev => ({ ...prev, [heroArticle.id]: true }))}
                  />
                ) : (
                  <Box sx={{ 
                    height: 250, 
                    bgcolor: '#1a237e', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 800
                  }}>
                    {heroArticle.category.charAt(0)}
                  </Box>
                )}
                <CardContent sx={{ p: 3 }}>
                  <Chip label={heroArticle.category} color="primary" sx={{ mb: 2 }} />
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
                    {heroArticle.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {heroArticle.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Автор: {heroArticle.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(heroArticle.date).toLocaleDateString('ru-RU')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      👁 {heroArticle.views?.toLocaleString() || 0} просмотров
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    component={LinkNext}
                    href={`/articles/${heroArticle.slug}`}
                    sx={{ bgcolor: '#1a237e' }}
                  >
                    Читать статью
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Другие статьи */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Все статьи</Typography>
            <Grid container spacing={3}>
              {otherArticles.map((article) => (
                <Grid size={{ xs: 12, sm: 6 }} key={article.id}>
                  <Card sx={{ height: '100%', overflow: 'hidden' }}>
                    {article.image && !imageErrors[article.id] ? (
                      <Box
                        component="img"
                        src={
                          article.image.startsWith('data:') ? article.image :
                          article.image.startsWith('http') ? article.image :
                          `/images/${article.image}`
                        }
                        alt={article.title}
                        sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                        onError={() => setImageErrors(prev => ({ ...prev, [article.id]: true }))}
                      />
                    ) : (
                      <Box sx={{ 
                        height: 100, 
                        bgcolor: '#1a237e', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem',
                        fontWeight: 800
                      }}>
                        {article.category.charAt(0)}
                      </Box>
                    )}
                    <CardContent>
                      <Chip label={article.category} size="small" sx={{ mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(article.date).toLocaleDateString('ru-RU')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          👁 {article.views?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Сайдбар */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ mb: 3, bgcolor: '#fff3e0', border: '2px solid #ff9800' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Срочно нужны деньги?</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Получите займ за 5 минут</Typography>
                <Button variant="contained" fullWidth href="/allmfo" sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}>
                  Получить деньги
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Популярные статьи</Typography>
                {otherArticles.slice(0, 3).map((a, i) => (
                  <Box key={a.id} sx={{ mb: 2, pb: 2, borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
                    <Typography 
                      component={LinkNext} 
                      href={`/articles/${a.slug}`}
                      variant="subtitle2" 
                      sx={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#1a237e' } }}
                    >
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(a.date).toLocaleDateString('ru-RU')}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#1a237e', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Подписаться</Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>Новые статьи на email</Typography>
                <Button variant="contained" fullWidth sx={{ bgcolor: 'white', color: '#1a237e', '&:hover': { bgcolor: '#e8eaf6' } }}>
                  Telegram
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
