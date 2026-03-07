'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, Grid, Chip, 
  Stack, TextField, InputAdornment, Divider, CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { Article, ArticlesApiResponse } from '@/types/article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';

// Цвета для категорий
const CATEGORY_COLORS: Record<string, string> = {
  'Советы': '#10b981',
  'Новости МФО': '#6366f1',
  'Финансы': '#0ea5e9',
  'Законодательство': '#f59e0b',
  'Акции': '#ec4899',
  'Рейтинги': '#8b5cf6',
};

function PostCard({ article }: { article: Article }) {
  const color = CATEGORY_COLORS[article.category] || '#10b981';
  
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          borderColor: 'transparent',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          bgcolor: color,
          borderRadius: '12px 12px 0 0',
        }}
      />
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Chip
          label={article.category}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            bgcolor: `${color}15`,
            color: color,
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 22,
            mb: 1.5,
          }}
        />
        <Typography
          component={Link}
          href={`/articles/${article.slug}`}
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: '#0f172a',
            mb: 1,
            lineHeight: 1.4,
            textDecoration: 'none',
            '&:hover': {
              color: '#10b981',
            },
          }}
        >
          {article.title}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.8rem',
            color: '#64748b',
            lineHeight: 1.5,
            mb: 2,
            flex: 1,
          }}
        >
          {article.excerpt}
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: '#f1f5f9' }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {typeof article.views === 'number' ? article.views.toLocaleString() : '0'}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {article.readingTime || 5} мин
              </Typography>
            </Stack>
          </Stack>
          <Box
            component={Link}
            href={`/articles/${article.slug}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#10b981',
              fontWeight: 600,
              fontSize: '0.8rem',
              textDecoration: 'none',
              '&:hover': {
                color: '#059669',
              },
            }}
          >
            Читать
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface ArticlesData {
  articles: Article[];
  featured: Article | null;
  total: number;
  totalPages: number;
  categories: Record<string, number>;
}

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<ArticlesData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '9');
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);
      const result: ArticlesApiResponse = await response.json();

      if (result.success) {
        // Получаем категории из всех статей
        const categoriesResponse = await fetch('/api/articles?page=1&limit=100');
        const categoriesResult: ArticlesApiResponse = await categoriesResponse.json();
        
        const categories: Record<string, number> = {};
        if (categoriesResult.data) {
          categoriesResult.data.forEach((article: Article) => {
            categories[article.category] = (categories[article.category] || 0) + 1;
          });
        }

        setData({
          articles: result.data || [],
          featured: result.featured || null,
          total: result.total || 0,
          totalPages: result.totalPages || 1,
          categories
        });
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Фильтрация по поиску на клиенте (для статических данных)
  const filteredArticles = data?.articles?.filter(article => 
    searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  ) || [];

  if (!data && loading) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const total = data?.total || 0;
  const categories = data?.categories || {};

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6, pt: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: '#0f172a',
              letterSpacing: '-0.03em',
              mb: 1,
            }}
          >
            Блог
          </Typography>
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#64748b',
              maxWidth: 500,
            }}
          >
            Полезные статьи о микрофинансах, советы заемщикам и новости рынка
          </Typography>
        </Box>

        {/* Search & Categories */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            bgcolor: 'white',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <TextField
              placeholder="Поиск статей..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: { md: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#10b981' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Все статьи (${total})`}
                onClick={() => { setSelectedCategory(null); setPage(1); }}
                sx={{
                  bgcolor: !selectedCategory ? '#0f172a' : '#f1f5f9',
                  color: !selectedCategory ? 'white' : '#475569',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  height: 32,
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              />
              {Object.entries(categories).map(([name, count]) => (
                <Chip
                  key={name}
                  label={`${name} (${count})`}
                  onClick={() => { setSelectedCategory(name); setPage(1); }}
                  sx={{ 
                    bgcolor: selectedCategory === name ? '#0f172a' : '#f1f5f9',
                    color: selectedCategory === name ? 'white' : '#475569',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    height: 32,
                    borderRadius: 2, 
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Card>

        {/* Featured Post */}
        {data?.featured && page === 1 && !selectedCategory && !searchQuery && (
          <Link href={`/articles/${data.featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  borderColor: 'transparent',
                  transform: 'translateY(-2px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                },
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      label={data.featured.category}
                      size="small"
                      sx={{
                        bgcolor: '#dcfce7',
                        color: '#059669',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                    <Chip
                      label="Избранное"
                      size="small"
                      sx={{
                        bgcolor: '#fef3c7',
                        color: '#b45309',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      color: '#0f172a',
                      letterSpacing: '-0.02em',
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {data.featured.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      lineHeight: 1.6,
                      mb: 2,
                      maxWidth: 600,
                    }}
                  >
                    {data.featured.excerpt}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <VisibilityIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {typeof data.featured.views === 'number' ? data.featured.views.toLocaleString() : '0'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {data.featured.readingTime || 5} мин
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#10b981',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Читать
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Box>
              </Stack>
            </Card>
          </Link>
        )}

        {/* Posts Grid */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#0f172a',
            mb: 2,
          }}
        >
          Все статьи
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredArticles.map((article) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                  <PostCard article={article} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Stack direction="row" spacing={1}>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setPage(i + 1)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        border: 'none',
                        bgcolor: page === i + 1 ? '#0f172a' : 'transparent',
                        color: page === i + 1 ? 'white' : '#475569',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: page === i + 1 ? '#0f172a' : '#f1f5f9',
                        },
                      }}
                    >
                      {i + 1}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
