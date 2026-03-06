'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Card, CardContent, Grid, Chip, Button, 
  Avatar, Stack, Pagination
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'
import StarIcon from '@mui/icons-material/Star'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// Преобразование статей
function getArticles(page: number, limit: number) {
  const articles: Article[] = staticArticles
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .map((a: StaticArticle) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content || a.excerpt,
      coverImage: a.image,
      category: a.category,
      author: a.author,
      status: a.status as 'DRAFT' | 'PUBLISHED',
      views: a.views || 0,
      readingTime: Math.ceil((a.content?.length || 200) / 1000),
      createdAt: new Date(a.date),
      updatedAt: new Date(a.date),
      publishedAt: new Date(a.date),
      tags: a.tags
    }))

  const featured = page === 1 ? articles[0] : null
  const totalPages = Math.ceil(articles.length / limit)
  const paginatedArticles = page === 1 ? articles.slice(1, limit + 1) : articles.slice((page - 1) * limit, page * limit)

  return { articles: paginatedArticles, featured, total: articles.length, totalPages }
}

// Категории
function getCategories() {
  const categories: Record<string, number> = {}
  staticArticles
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .forEach((a: StaticArticle) => {
      categories[a.category] = (categories[a.category] || 0) + 1
    })
  return Object.entries(categories).map(([name, count]) => ({ name, count }))
}

// Популярные статьи
function getPopularArticles() {
  return [...staticArticles]
    .filter((a: StaticArticle) => a.status === 'PUBLISHED')
    .sort((a: StaticArticle, b: StaticArticle) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
}

export default function ArticlesPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ articles: Article[], featured: Article | null, total: number, totalPages: number } | null>(null)

  useEffect(() => {
    setData(getArticles(page, 9))
  }, [page])

  const categories = getCategories()
  const popularArticles = getPopularArticles()

  if (!data) return null

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, pt: 4 }}>

      <Container maxWidth="md">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Статьи о займах и финансах
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
          Полезные материалы о микрозаймах, кредитных картах и управлении личными финансами
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Featured Article - Герой дня */}
            {data.featured && page === 1 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 4, height: 24, bgcolor: '#667eea', borderRadius: 1 }} />
                  Герой дня
                </Typography>
                <Card 
                  component={Link}
                  href={`/articles/${data.featured.slug}`}
                  sx={{ 
                    textDecoration: 'none',
                    borderRadius: 2, 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                  }}
                >
                  <Grid container>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ position: 'relative', height: { xs: 200, md: 280 } }}>
                        {data.featured.coverImage ? (
                          <Image src={data.featured.coverImage} alt={data.featured.title} fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ height: '100%', bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h1" sx={{ color: 'white', fontWeight: 700 }}>{data.featured.category.charAt(0)}</Typography>
                          </Box>
                        )}
                        <Chip label={data.featured.category} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#667eea', color: 'white' }} />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                          {data.featured.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {data.featured.excerpt}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontSize: 14 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                            {data.featured.views.toLocaleString()}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16 }} />
                            {data.featured.readingTime} мин
                          </Box>
                        </Stack>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            )}

            {/* Все статьи */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 4, height: 24, bgcolor: '#667eea', borderRadius: 1 }} />
                Все статьи
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {data.articles.map((article) => (
                <Grid size={{ xs: 12, md: 6 }} key={article.id}>
                  <Card 
                    component={Link}
                    href={`/articles/${article.slug}`}
                    sx={{ 
                      textDecoration: 'none',
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 160 }}>
                      {article.coverImage ? (
                        <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ height: '100%', bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>{article.category.charAt(0)}</Typography>
                        </Box>
                      )}
                      <Chip label={article.category} size="small" sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(255,255,255,0.9)', fontSize: 11 }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.4, color: '#212121' }}>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.excerpt}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontSize: 13 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          {article.views.toLocaleString()}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {article.readingTime} мин
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {data.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={data.totalPages} 
                  page={page} 
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Grid>

          {/* Сайдбар */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* CTA */}
              <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800', borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Срочно нужны деньги?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Получите займ за 5 минут без проверки кредитной истории</Typography>
                <Button variant="contained" fullWidth component={Link} href="/allmfo" sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, py: 1.5 }}>Получить деньги</Button>
              </Card>

              {/* Категории */}
              <Card sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Рубрики</Typography>
                <Stack spacing={1}>
                  {categories.map((cat) => (
                    <Box 
                      key={cat.name}
                      component={Link}
                      href={`/articles?category=${encodeURIComponent(cat.name)}`}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        textDecoration: 'none',
                        p: 1.5,
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#424242' }}>{cat.name}</Typography>
                      <Chip label={cat.count} size="small" sx={{ bgcolor: '#e8eaf6', color: '#667eea', fontSize: 12 }} />
                    </Box>
                  ))}
                </Stack>
              </Card>

              {/* Популярные статьи */}
              <Card sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Популярные статьи</Typography>
                <Stack spacing={2}>
                  {popularArticles.map((article, index) => (
                    <Box 
                      key={article.id}
                      component={Link}
                      href={`/articles/${article.slug}`}
                      sx={{ textDecoration: 'none', '&:hover .article-title': { color: '#667eea' } }}
                    >
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#e8eaf6', lineHeight: 1 }}>{index + 1}</Typography>
                        <Box>
                          <Typography className="article-title" variant="body2" sx={{ fontWeight: 600, color: '#212121', transition: 'color 0.2s', lineHeight: 1.4 }}>
                            {article.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{article.views?.toLocaleString()} просмотров</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>

              {/* Топ МФО */}
              <Card sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Топ МФО</Typography>
                <Stack spacing={2}>
                  {[
                    { name: 'Екапуста', rating: 4.8, reviews: 45000 },
                    { name: 'Займер', rating: 4.7, reviews: 38000 },
                    { name: 'MoneyMan', rating: 4.6, reviews: 32000 },
                    { name: 'Lime-zaim', rating: 4.5, reviews: 28000 }
                  ].map((mfo) => (
                    <Box 
                      key={mfo.name}
                      component={Link}
                      href="/allmfo"
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        textDecoration: 'none',
                        p: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea', fontSize: 14, fontWeight: 700 }}>{mfo.name.charAt(0)}</Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#212121' }}>{mfo.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{mfo.rating}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
                <Button 
                  fullWidth 
                  component={Link} 
                  href="/allmfo" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2, color: '#667eea', fontWeight: 600 }}
                >
                  Все МФО
                </Button>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
