'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Box, Container, Typography, Grid, Card, CardContent, Button, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Switch, FormControlLabel, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Snackbar, Alert,
  TableSortLabel
} from '@mui/material'
import { 
  Plus, Edit2, Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Partner {
  id: number
  name: string
  slug?: string
  description?: string
  image_url?: string
  link?: string
  category?: string
  is_active: boolean
  sort_order: number
}

const initialForm: Partial<Partner> = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  link: '',
  category: '',
  is_active: true,
  sort_order: 0
}

export default function AdminPartnersPage() {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null)
  const [form, setForm] = useState<Partial<Partner>>(initialForm)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Проверка авторизации
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      router.push('/admin')
    }
  }, [router])

  const loadPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/partners/admin')
      if (res.ok) {
        const data = await res.json()
        setPartners(data)
      }
    } catch (error) {
      console.error('Error loading partners:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPartners()
  }, [loadPartners])

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner)
      setForm(partner)
    } else {
      setEditingPartner(null)
      setForm(initialForm)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingPartner(null)
    setForm(initialForm)
  }

  const handleSave = async () => {
    try {
      const method = editingPartner?.id ? 'PUT' : 'POST'
      const res = await fetch('/api/partners/admin', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setSnackbar({ open: true, message: 'Сохранено!', severity: 'success' })
        loadPartners()
        handleCloseDialog()
      } else {
        setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' })
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить компанию?')) return

    try {
      const res = await fetch(`/api/partners/admin?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSnackbar({ open: true, message: 'Удалено!', severity: 'success' })
        loadPartners()
      } else {
        setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' })
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' })
    }
  }

  const handleToggleActive = async (partner: Partner) => {
    try {
      const res = await fetch('/api/partners/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...partner, is_active: !partner.is_active })
      })
      if (res.ok) {
        loadPartners()
      }
    } catch (error) {
      console.error('Error toggling partner:', error)
    }
  }

  const handleMove = async (partner: Partner, direction: 'up' | 'down') => {
    const index = partners.findIndex(p => p.id === partner.id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === partners.length - 1) return

    const newOrder = direction === 'up' ? partner.sort_order - 1 : partner.sort_order + 1
    
    try {
      const res = await fetch('/api/partners/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...partner, sort_order: newOrder })
      })
      if (res.ok) {
        loadPartners()
      }
    } catch (error) {
      console.error('Error moving partner:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Управление компаниями
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
        >
          Добавить компанию
        </Button>
      </Box>

      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Сортировка</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Логотип</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Категория</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ссылка</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Активен</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.sort((a, b) => a.sort_order - b.sort_order).map((partner) => (
                <TableRow key={partner.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleMove(partner, 'up')}
                        disabled={partners.indexOf(partner) === 0}
                      >
                        <Typography>↑</Typography>
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleMove(partner, 'down')}
                        disabled={partners.indexOf(partner) === partners.length - 1}
                      >
                        <Typography>↓</Typography>
                      </IconButton>
                      <Typography variant="body2" sx={{ ml: 1 }}>{partner.sort_order}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {partner.image_url ? (
                      <Box 
                        component="img" 
                        src={partner.image_url} 
                        alt={partner.name}
                        sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1 }}
                      />
                    ) : (
                      <Box sx={{ width: 40, height: 40, bgcolor: '#eee', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography>{partner.name?.charAt(0)}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{partner.name}</Typography>
                    {partner.description && (
                      <Typography variant="caption" color="text.secondary">
                        {partner.description.substring(0, 50)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{partner.category || '-'}</TableCell>
                  <TableCell>
                    {partner.link ? (
                      <Typography 
                        component="a" 
                        href={partner.link} 
                        target="_blank" 
                        sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        Ссылка
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.is_active}
                      onChange={() => handleToggleActive(partner)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(partner)} color="primary">
                      <Edit2 size={18} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(partner.id)} color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {partners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Нет компаний. Добавьте первую!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалог добавления/редактирования */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPartner ? 'Редактировать компанию' : 'Добавить компанию'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Название"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Slug (URL)"
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={2}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="URL логотипа (изображение)"
                value={form.image_url || ''}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                helperText="URL изображения или путь к файлу"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ссылка на сайт"
                value={form.link || ''}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Категория"
                value={form.category || ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Порядок сортировки"
                value={form.sort_order || 0}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_active ?? true}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label="Активен"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!form.name}
            sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
