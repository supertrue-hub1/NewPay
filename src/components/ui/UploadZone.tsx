'use client'

import { useState, useCallback, useRef } from 'react'
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from '@mui/icons-material/Image'

interface UploadZoneProps {
  onUploadSuccess?: (image: UploadedImage) => void
  acceptedTypes?: string[]
  maxSize?: number
}

interface UploadedImage {
  id: number
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  size: number
  width?: number
  height?: number
  createdAt?: string
}

const DEFAULT_ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function UploadZone({ 
  onUploadSuccess,
  acceptedTypes = DEFAULT_ACCEPTED,
  maxSize = DEFAULT_MAX_SIZE 
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showError = (msg: string) => {
    setError(msg)
  }

  const showSuccess = (msg: string) => {
    setSuccess(msg)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = async (file: File) => {
    // Валидация типа
    if (!acceptedTypes.includes(file.type)) {
      showError('Недопустимый тип файла. Разрешены: JPG, PNG, WebP, GIF, SVG')
      return
    }

    // Валидация размера
    if (file.size > maxSize) {
      showError(`Файл слишком большой. Максимум ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        showSuccess('Изображение загружено!')
        onUploadSuccess?.(result.data)
      } else {
        showError(result.error || 'Ошибка загрузки')
      }
    } catch (err) {
      showError('Ошибка загрузки файла')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <>
      <Box
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? '#10b981' : '#d1d5db',
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragging ? '#ecfdf5' : '#f9fafb',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#10b981',
            bgcolor: '#f0fdf4',
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <Box sx={{ py: 2 }}>
            <CircularProgress size={48} sx={{ color: '#10b981', mb: 2 }} />
            <Typography color="text.secondary">
              Загрузка...
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: isDragging ? '#d1fae5' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 32, color: isDragging ? '#10b981' : '#9ca3af' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, color: '#111827' }}>
              {isDragging ? 'Отпустите для загрузки' : 'Перетащите изображение'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              или нажмите для выбора файла
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              {['JPG', 'PNG', 'WebP', 'GIF', 'SVG'].map((type) => (
                <Box
                  key={type}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: '#e5e7eb',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 500,
                  }}
                >
                  {type}
                </Box>
              ))}
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#e5e7eb',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: 500,
                }}
              >
                до 5MB
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </>
  )
}
