'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import CodeIcon from '@mui/icons-material/Code'
import ImageIcon from '@mui/icons-material/Image'

interface ImageCardProps {
  image: ImageData
  onDelete?: (id: number) => void
  onUpdate?: (id: number, alt: string) => void
}

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

export default function ImageCard({ image, onDelete, onUpdate }: ImageCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [altText, setAltText] = useState(image.alt || '')
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSnackbar(`${label} скопирован!`)
    } catch {
      showSnackbar('Ошибка копирования', 'error')
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (!confirm('Удалить изображение?')) return

    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        showSnackbar('Изображение удалено')
        onDelete?.(image.id)
      } else {
        showSnackbar(result.error || 'Ошибка удаления', 'error')
      }
    } catch {
      showSnackbar('Ошибка удаления', 'error')
    }
    handleMenuClose()
  }

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: altText }),
      })
      const result = await response.json()

      if (result.success) {
        showSnackbar('Alt текст обновлён')
        onUpdate?.(image.id, altText)
        setEditDialogOpen(false)
      } else {
        showSnackbar(result.error || 'Ошибка обновления', 'error')
      }
    } catch {
      showSnackbar('Ошибка обновления', 'error')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const dateStr = new Date(image.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            '& .image-actions': {
              opacity: 1,
            },
          },
        }}
      >
        {/* Превью */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '66.67%',
            bgcolor: '#f3f4f6',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={image.url}
            alt={image.alt || image.originalName}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Actions overlay */}
          <Box
            className="image-actions"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 0.5,
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
          >
            <Tooltip title="Копировать URL">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(image.url, 'URL')}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Копировать Markdown">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(`![${image.alt || ''}](${image.url})`, 'Markdown')}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                <CodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Тип файла badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              px: 1,
              py: 0.25,
              bgcolor: 'rgba(0,0,0,0.6)',
              borderRadius: 1,
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            {image.mimeType.split('/')[1]}
          </Box>
        </Box>

        {/* Информация */}
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {image.originalName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {formatSize(image.size)}
                {image.width && image.height && ` • ${image.width}×${image.height}`}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {image.alt && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#6b7280',
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              ALT: {image.alt}
            </Typography>
          )}
          
          <Typography sx={{ fontSize: '0.7rem', color: '#d1d5db', mt: 0.5 }}>
            {dateStr}
          </Typography>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { copyToClipboard(image.url, 'URL'); handleMenuClose(); }}>
          <LinkIcon sx={{ mr: 1, fontSize: 18 }} /> Копировать URL
        </MenuItem>
        <MenuItem onClick={() => { copyToClipboard(`![${image.alt || ''}](${image.url})`, 'Markdown'); handleMenuClose(); }}>
          <CodeIcon sx={{ mr: 1, fontSize: 18 }} /> Копировать Markdown
        </MenuItem>
        <MenuItem onClick={() => { copyToClipboard(`<img src="${image.url}" alt="${image.alt || ''}" />`, 'HTML'); handleMenuClose(); }}>
          <ImageIcon sx={{ mr: 1, fontSize: 18 }} /> Копировать HTML
        </MenuItem>
        <MenuItem onClick={() => { setEditDialogOpen(true); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Редактировать ALT
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Удалить
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать ALT текст</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ALT текст"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Введите alt текст для изображения"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
