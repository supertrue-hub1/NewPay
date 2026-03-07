'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import UploadZone from '@/components/ui/UploadZone'
import ImageCard from '@/components/ui/ImageCard'

interface ImageData {
  id: number
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt?: string
  createdAt: string
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const limit = 12

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      if (search) {
        params.set('search', search)
      }

      const response = await fetch(`/api/images?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setImages(result.data || [])
        setTotalPages(result.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // Debounce поиска
  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setPage(1)
    }, 500)
    setSearchTimeout(timeout)
  }

  const handleUploadSuccess = (image: any) => {
    const newImage: ImageData = {
      ...image,
      createdAt: image.createdAt || new Date().toISOString()
    }
    setImages(prev => [newImage, ...prev])
  }

  const handleDelete = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleUpdate = (id: number, alt: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, alt } : img
    ))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
      <Container maxWidth="xl">
        {/* Заголовок */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}
          >
            Управление изображениями
          </Typography>
          <Typography color="text.secondary">
            Загружайте и управляйте изображениями для статей
          </Typography>
        </Box>

        {/* Загрузка */}
        <Box sx={{ mb: 4 }}>
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        </Box>

        {/* Поиск */}
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
            sx={{
              maxWidth: 300,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Сетка изображений */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : images.length === 0 ? (
          <Alert severity="info">
            Изображения не найдены. Загрузите первое изображение!
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {images.map((image) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                  <ImageCard 
                    image={image} 
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
