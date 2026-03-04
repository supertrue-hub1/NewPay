'use client'

import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box, Typography, Switch, FormControlLabel,
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { MFO } from '@/data/mfo'

interface MfoModalProps {
  open: boolean
  onClose: () => void
  onSave: (mfo: Omit<MFO, 'id'>) => void
  mfo?: MFO | null
  title: string
}

export default function MfoModal({ open, onClose, onSave, mfo, title }: MfoModalProps) {
  const [formData, setFormData] = useState<Omit<MFO, 'id'>>({
    name: mfo?.name || '',
    logo: mfo?.logo || '',
    rating: mfo?.rating || 4.5,
    reviews: mfo?.reviews || 0,
    sumMin: mfo?.sumMin || 1000,
    sumMax: mfo?.sumMax || 30000,
    termMin: mfo?.termMin || 5,
    termMax: mfo?.termMax || 30,
    percent: mfo?.percent || 0.8,
    firstFree: mfo?.firstFree || false,
    instant: mfo?.instant || true,
    badge: mfo?.badge || '',
    siteUrl: mfo?.siteUrl || '',
    infoModal: mfo?.infoModal || '',
  })

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Название"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Логотип (символ)"
              value={formData.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Рейтинг"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              value={formData.rating}
              onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Количество отзывов"
              type="number"
              value={formData.reviews}
              onChange={(e) => handleChange('reviews', parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Сумма мин."
              type="number"
              value={formData.sumMin}
              onChange={(e) => handleChange('sumMin', parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Сумма макс."
              type="number"
              value={formData.sumMax}
              onChange={(e) => handleChange('sumMax', parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Срок мин. (дней)"
              type="number"
              value={formData.termMin}
              onChange={(e) => handleChange('termMin', parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Срок макс. (дней)"
              type="number"
              value={formData.termMax}
              onChange={(e) => handleChange('termMax', parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Ставка (% в день)"
              type="number"
              inputProps={{ step: 0.1 }}
              value={formData.percent}
              onChange={(e) => handleChange('percent', parseFloat(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Бейдж"
              value={formData.badge}
              onChange={(e) => handleChange('badge', e.target.value)}
              placeholder="Например: Лучший выбор"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="URL сайта"
              value={formData.siteUrl}
              onChange={(e) => handleChange('siteUrl', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Информация"
              multiline
              rows={3}
              value={formData.infoModal}
              onChange={(e) => handleChange('infoModal', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.firstFree}
                  onChange={(e) => handleChange('firstFree', e.target.checked)}
                />
              }
              label="Первый займ 0%"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.instant}
                  onChange={(e) => handleChange('instant', e.target.checked)}
                />
              }
              label="Мгновенная выдача"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  )
}
