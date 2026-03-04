'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Card, CardContent, Grid, Chip, Button, 
  Breadcrumbs, Link as MuiLink, Avatar, Stack
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import { articles as staticArticles, Article as StaticArticle } from '@/data/articles-data'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShareIcon from '@mui/icons-material/Share'
import { useParams } from 'next/navigation'

function getArticle(slug: string): Article | null {
  const staticArticle = staticArticles.find((a: StaticArticle) => a.slug === slug)
  if (!staticArticle) return null

  return {
    id: staticArticle.id,
    slug: staticArticle.slug,
    title: staticArticle.title,
    excerpt: staticArticle.excerpt,
    content: staticArticle.content || staticArticle.excerpt,
    coverImage: staticArticle.image,
    category: staticArticle.category,
    author: staticArticle.author,
    status: staticArticle.status as 'DRAFT' | 'PUBLISHED',
    views: staticArticle.views || 0,
    readingTime: Math.ceil((staticArticle.content?.length || 200) / 1000),
    createdAt: new Date(staticArticle.date),
    updatedAt: new Date(staticArticle.date),
    publishedAt: new Date(staticArticle.date),
    tags: staticArticle.tags
  }
}

export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (slug) {
      setArticle(getArticle(slug))
    }
  }, [slug])

  if (!article) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Typography>Статья не найдена</Typography>
        </Container>
      </Box>
    )
  }

  const relatedArticles = staticArticles
    .filter((a: StaticArticle) => a.slug !== slug && a.status === 'PUBLISHED')
    .slice(0, 3)
    .map((a: StaticArticle) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      coverImage: a.image
    }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 5 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
            sx={{ mb: 3, '& .MuiBreadcrumbs-link': { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }, '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.5)' } }}
          >
            <MuiLink component={Link} href="/" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Главная</MuiLink>
            <MuiLink component={Link} href="/articles" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Статьи</MuiLink>
            <Typography sx={{ color: 'white' }}>{article.title}</Typography>
          </Breadcrumbs>

          <Chip label={article.category} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 2 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>{article.title}</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, fontWeight: 400 }}>{article.excerpt}</Typography>

          <Stack direction="row" spacing={3} sx={{ color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 14 }}>{article.author.charAt(0)}</Avatar>
              <Typography variant="body2">{article.author}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{new Date(article.publishedAt || article.createdAt).toLocaleDateString('ru-RU')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{article.views.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{article.readingTime} мин</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -3, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {article.coverImage && (
              <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', height: { xs: 200, md: 350 } }}>
                  <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                </Box>
              </Card>
            )}

            <Card sx={{ borderRadius: 2, p: { xs: 2, md: 4 } }}>
              <Box 
                sx={{ 
                  '& h1': { fontSize: '1.75rem', fontWeight: 700, mt: 3, mb: 2, color: '#1a237e' },
                  '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2, color: '#1a237e' },
                  '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1, color: '#303f9f' },
                  '& p': { mb: 2, lineHeight: 1.8, color: '#424242' },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& a': { color: '#667eea' },
                  '& table': { width: '100%', borderCollapse: 'collapse', my: 2 },
                  '& th, & td': { border: '1px solid #e0e0e0', p: 1.5, textAlign: 'left' },
                  '& th': { bgcolor: '#f5f5f5', fontWeight: 600 },
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.tags && article.tags.length > 0 && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Теги:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {article.tags.map((tag) => (
                      <Chip key={tag} label={#} size="small" component={Link} href={/articles?tag=} sx={{ cursor: 'pointer' }} />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShareIcon fontSize="small" /> Поделиться:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" size="small" href={https://vk.com/share.php?url=/articles/} target="_blank" sx={{ bgcolor: '#2787f5' }}>ВКонтакте</Button>
                  <Button variant="contained" size="small" href={https://t.me/share/url?url=/articles/&text=} target="_blank" sx={{ bgcolor: '#0088cc' }}>Telegram</Button>
                </Stack>
              </Box>
            </Card>

            {relatedArticles.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Похожие статьи</Typography>
                <Grid container spacing={3}>
                  {relatedArticles.map((related) => (
                    <Grid size={{ xs: 12, md: 4 }} key={related.id}>
                      <Card component={Link} href={/articles/} sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                        <Box sx={{ position: 'relative', height: 140 }}>
                          {related.coverImage ? (
                            <Image src={related.coverImage} alt={related.title} fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <Box sx={{ height: '100%', bgcolor: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>{related.category.charAt(0)}</Typography>
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Chip label={related.category} size="small" sx={{ mb: 1, fontSize: 11 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{related.title}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800', borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Срочно нужны деньги?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Получите займ за 5 минут</Typography>
                <Button variant="contained" fullWidth component={Link} href="/allmfo" sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, py: 1.5 }}>Получить деньги</Button>
              </Card>

              <Card sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Популярное</Typography>
                <Stack spacing={2}>
                  {staticArticles.filter((a: StaticArticle) => a.status === 'PUBLISHED').sort((a: StaticArticle, b: StaticArticle) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((a: StaticArticle) => (
                    <Box key={a.id} component={Link} href={/articles/} sx={{ textDecoration: 'none', '&:hover .article-title': { color: '#667eea' } }}>
                      <Typography className="article-title" variant="body2" sx={{ fontWeight: 600, color: '#212121', transition: 'color 0.2s' }}>{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.views?.toLocaleString()} просмотров</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>

              <Card sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Топ МФО</Typography>
                <Stack spacing={2}>
                  {[{ name: 'Екапуста', rating: 4.8 }, { name: 'Займер', rating: 4.7 }, { name: 'MoneyMan', rating: 4.6 }, { name: 'Lime-zaim', rating: 4.5 }].map((mfo) => (
                    <Box key={mfo.name} component={Link} href="/allmfo" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', p: 1, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea', fontSize: 14, fontWeight: 700 }}>{mfo.name.charAt(0)}</Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#212121' }}>{mfo.name}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 700 }}>★ {mfo.rating}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, image: article.coverImage, datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(), author: { '@type': 'Person', name: article.author }, publisher: { '@type': 'Organization', name: 'NewPay' } }) }} />
    </Box>
  )
}