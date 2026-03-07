'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Card, CardContent, Grid, Chip, Button, 
  Breadcrumbs, Link as MuiLink, Avatar, Stack, CircularProgress
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShareIcon from '@mui/icons-material/Share'
import StarIcon from '@mui/icons-material/Star'
import { useParams } from 'next/navigation'

interface MfoCompany {
  id: number
  name: string
  logo: string
  rating: number
  reviews: number
}

// Функция для получения статьи из API (БД)
async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`)
    if (response.ok) {
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        const row = data.data[0]
        return {
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content || row.excerpt,
          coverImage: row.coverImage || row.cover_image,
          category: row.category,
          author: row.author || 'Редакция',
          status: row.status || 'PUBLISHED',
          views: row.views || 0,
          readingTime: row.readingTime || row.reading_time || Math.ceil((row.content?.length || 200) / 1000),
          createdAt: row.createdAt || row.created_at ? new Date(row.createdAt || row.created_at) : new Date(),
          updatedAt: row.updatedAt || row.updated_at ? new Date(row.updatedAt || row.updated_at) : new Date(),
          publishedAt: row.publishedAt || row.published_at ? new Date(row.publishedAt || row.published_at) : new Date(),
          tags: row.tags || []
        }
      }
    }
  } catch (error) {
    console.error('Error fetching article:', error)
  }
  return null
}

// Функция для получения всех статей (для related articles)
async function fetchAllArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/api/articles?page=1&limit=100')
    if (response.ok) {
      const data = await response.json()
      if (data.data) {
        return data.data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          coverImage: row.coverImage || row.cover_image,
          category: row.category,
          author: row.author,
          status: row.status,
          views: row.views || 0,
          readingTime: row.readingTime || row.reading_time,
          createdAt: row.createdAt || row.created_at,
          updatedAt: row.updatedAt || row.updated_at,
          publishedAt: row.publishedAt || row.published_at,
          tags: row.tags || []
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching all articles:', error)
  }
  return []
}

export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [topMfo, setTopMfo] = useState<MfoCompany[]>([])
  const [loadingArticle, setLoadingArticle] = useState(true)
  const [loadingMfo, setLoadingMfo] = useState(true)

  // Загружаем статью из БД
  useEffect(() => {
    async function loadArticle() {
      if (slug) {
        setLoadingArticle(true)
        const fetchedArticle = await fetchArticle(slug)
        setArticle(fetchedArticle)
        
        // Также загружаем все статьи для related articles
        const articles = await fetchAllArticles()
        setAllArticles(articles)
        
        setLoadingArticle(false)
      }
    }
    loadArticle()
  }, [slug])

  useEffect(() => {
    async function fetchTopMfo() {
      try {
        const response = await fetch('/api/mfo')
        const data = await response.json()
        if (Array.isArray(data)) {
          // Сортируем по рейтингу и берём топ 5
          const sorted = [...data].sort((a: MfoCompany, b: MfoCompany) => (b.rating || 0) - (a.rating || 0)).slice(0, 5)
          setTopMfo(sorted)
        }
      } catch (error) {
        console.error('Error fetching MFO:', error)
      } finally {
        setLoadingMfo(false)
      }
    }
    fetchTopMfo()
  }, [])

  if (loadingArticle) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!article) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Typography>Статья не найдена</Typography>
        </Container>
      </Box>
    )
  }

  // Related articles из БД
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug && a.status === 'PUBLISHED')
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      coverImage: a.coverImage
    }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6, pt: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94a3b8' }} />}
          sx={{ mb: 3 }}
        >
          <MuiLink component={Link} href="/" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Главная</MuiLink>
          <MuiLink component={Link} href="/articles" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Статьи</MuiLink>
          <Typography sx={{ color: '#0f172a' }}>{article.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Category & Title */}
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={article.category} 
                sx={{ 
                  bgcolor: '#dcfce7', 
                  color: '#059669', 
                  fontWeight: 600, 
                  fontSize: '0.75rem', 
                  height: 24,
                  mb: 2 
                }}
              />
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                {article.title}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#64748b', 
                  mb: 3, 
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.5
                }}
              >
                {article.excerpt}
              </Typography>

              <Stack direction="row" spacing={3} sx={{ color: '#64748b', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#e2e8f0', fontSize: 12, color: '#475569' }}>
                    {article.author.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{article.author}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2">{new Date(article.publishedAt || article.createdAt).toLocaleDateString('ru-RU')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{article.views.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{article.readingTime} мин</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Cover Image */}
            {article.coverImage && (
              <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <Box sx={{ position: 'relative', height: { xs: 200, md: 350 } }}>
                  <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                </Box>
              </Card>
            )}

            {/* Article Content */}
            <Card sx={{ borderRadius: 3, p: { xs: 2, md: 4 }, border: '1px solid #e2e8f0' }}>
              <Box 
                sx={{ 
                  '& h1': { fontSize: '1.75rem', fontWeight: 700, mt: 3, mb: 2, color: '#0f172a' },
                  '& h2': { fontSize: '1.4rem', fontWeight: 600, mt: 3, mb: 2, color: '#0f172a' },
                  '& h3': { fontSize: '1.15rem', fontWeight: 600, mt: 2, mb: 1, color: '#1e293b' },
                  '& p': { mb: 2, lineHeight: 1.8, color: '#475569' },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1, color: '#475569' },
                  '& a': { color: '#10b981' },
                  '& table': { width: '100%', borderCollapse: 'collapse', my: 2 },
                  '& th, & td': { border: '1px solid #e2e8f0', p: 1.5, textAlign: 'left' },
                  '& th': { bgcolor: '#f8fafc', fontWeight: 600 },
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.tags && article.tags.length > 0 && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#0f172a' }}>Теги:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {article.tags.map((tag) => (
                      <Chip key={tag} label={`#${tag}`} size="small" component={Link} href={`/articles?tag=${encodeURIComponent(tag)}`} sx={{ cursor: 'pointer', bgcolor: '#f1f5f9', color: '#475569' }} />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
                  <ShareIcon fontSize="small" /> Поделиться:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="contained" 
                    size="small" 
                    href={`https://vk.com/share.php?url=${siteUrl}/articles/${article.slug}`} 
                    target="_blank" 
                    sx={{ bgcolor: '#2787f5', '&:hover': { bgcolor: '#1a6ed8' } }}
                  >
                    ВКонтакте
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small" 
                    href={`https://t.me/share/url?url=${siteUrl}/articles/${article.slug}&text=${article.title}`} 
                    target="_blank" 
                    sx={{ bgcolor: '#0088cc', '&:hover': { bgcolor: '#0070a8' } }}
                  >
                    Telegram
                  </Button>
                </Stack>
              </Box>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>Похожие статьи</Typography>
                <Grid container spacing={3}>
                  {relatedArticles.map((related) => (
                    <Grid size={{ xs: 12, md: 4 }} key={related.id}>
                      <Card 
                        component={Link} 
                        href={`/articles/${related.slug}`} 
                        sx={{ 
                          textDecoration: 'none', 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          borderRadius: 3,
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }
                        }}
                      >
                        <Box sx={{ position: 'relative', height: 140 }}>
                          {related.coverImage ? (
                            <Image src={related.coverImage} alt={related.title} fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <Box sx={{ height: '100%', bgcolor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>{related.category.charAt(0)}</Typography>
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Chip label={related.category} size="small" sx={{ mb: 1, fontSize: 11, bgcolor: '#dcfce7', color: '#059669' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>{related.title}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* CTA */}
              <Card sx={{ bgcolor: '#fffbeb', border: '2px solid #fbbf24', borderRadius: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>Срочно нужны деньги?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Получите займ за 5 минут без проверки кредитной истории</Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  component={Link} 
                  href="/allmfo" 
                  sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, py: 1.5, borderRadius: 2, fontWeight: 600 }}
                >
                  Получить деньги
                </Button>
              </Card>

              {/* Popular Articles */}
              <Card sx={{ borderRadius: 3, p: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>Популярное</Typography>
                <Stack spacing={2}>
                  {allArticles
                    .filter((a) => a.status === 'PUBLISHED')
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((a) => (
                      <Box key={a.id} component={Link} href={`/articles/${a.slug}`} sx={{ textDecoration: 'none', '&:hover .article-title': { color: '#10b981' } }}>
                        <Typography className="article-title" variant="body2" sx={{ fontWeight: 600, color: '#212121', transition: 'color 0.2s', lineHeight: 1.4 }}>{a.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{a.views?.toLocaleString()} просмотров</Typography>
                      </Box>
                    ))
                  }
                </Stack>
              </Card>

              {/* Top MFO from DB */}
              <Card sx={{ borderRadius: 3, p: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>Топ МФО</Typography>
                {loadingMfo ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : topMfo.length > 0 ? (
                  <Stack spacing={2}>
                    {topMfo.map((mfo) => (
                      <Box 
                        key={mfo.id} 
                        component={Link} 
                        href={`/mfo/${mfo.name.toLowerCase().replace(/\s+/g, '-')}`}
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          textDecoration: 'none', 
                          p: 1.5, 
                          borderRadius: 2, 
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: '#f8fafc', borderColor: '#10b981' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            src={mfo.logo} 
                            sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#10b981', fontSize: 14, fontWeight: 700 }}
                          >
                            {mfo.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>{mfo.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{mfo.reviews?.toLocaleString() || 0} отзывов</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{mfo.rating?.toFixed(1) || '0.0'}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">Загрузка...</Typography>
                )}
                <Button 
                  fullWidth 
                  component={Link} 
                  href="/allmfo" 
                  sx={{ mt: 2, color: '#10b981', fontWeight: 600 }}
                >
                  Все МФО
                </Button>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, image: article.coverImage, datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(), author: { '@type': 'Person', name: article.author }, publisher: { '@type': 'Organization', name: 'NewPay' } }) }} />
    </Box>
  )
}
