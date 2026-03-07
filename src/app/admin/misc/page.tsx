'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  Box, Typography, Card, CardContent, Grid, TextField, Button, 
  Switch, FormControlLabel, Divider, Alert, Snackbar, Chip, Select, 
  MenuItem, FormControl, InputLabel
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

interface ExitIntentSettings {
  enabled: boolean
  mode: 'static' | 'ai'
  // Static mode settings
  staticMfoId: string
  // AI mode defaults
  defaultAmount: number
  defaultTerm: number
  // Display settings
  showOnDesktop: boolean
  showOnMobile: boolean
  scrollThreshold: number // percentage
  // Messages
  headline: string
  subheadline: string
}

const DEFAULT_SETTINGS: ExitIntentSettings = {
  enabled: true,
  mode: 'static',
  staticMfoId: '1',
  defaultAmount: 15000,
  defaultTerm: 14,
  showOnDesktop: true,
  showOnMobile: true,
  scrollThreshold: 70,
  headline: 'Стоп! Не уходите — для вас есть спецпредложение!',
  subheadline: 'Первый займ под 0% — одобрение за 3 минуты'
}

const MFO_OPTIONS = [
  { id: '1', name: 'Екапуста' },
  { id: '2', name: 'Займер' },
  { id: '3', name: 'МигКредит' },
  { id: '4', name: 'Joy Money' },
  { id: '5', name: 'Турбозайм' },
]

const STORAGE_KEY = 'exit_intent_settings'

// Функция для загрузки настроек
const loadSettings = (): ExitIntentSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  }
  return DEFAULT_SETTINGS
}

export default function MiscSettingsPage() {
  const [settings, setSettings] = useState<ExitIntentSettings>(loadSettings)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const updateSetting = useCallback(<K extends keyof ExitIntentSettings>(
    key: K, 
    value: ExitIntentSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSnackbar({ open: true, message: 'Настройки сохранены!', severity: 'success' })
    } catch (e) {
      setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' })
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(STORAGE_KEY)
    setSnackbar({ open: true, message: 'Настройки сброшены', severity: 'success' })
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, color: 'white', fontWeight: 700 }}>
        Разное
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
        Дополнительные настройки сайта
      </Typography>

      {/* Exit Intent Popup Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Exit Intent Popup
            </Typography>
            <Chip 
              label={settings.enabled ? 'Включён' : 'Выключен'} 
              color={settings.enabled ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Popup появляется когда пользователь собирается уйти со страницы (двигает мышь к верхней части экрана) 
            или прокручивает страницу более {settings.scrollThreshold}%. Показывает персональное предложение займа.
          </Alert>

          <Grid container spacing={3}>
            {/* Основные настройки */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.enabled}
                    onChange={(e) => updateSetting('enabled', e.target.checked)}
                  />
                }
                label="Включить popup"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Режим работы</InputLabel>
                <Select
                  value={settings.mode}
                  label="Режим работы"
                  onChange={(e) => updateSetting('mode', e.target.value as 'static' | 'ai')}
                >
                  <MenuItem value="static">
                    <Box>
                      <Typography>Статический</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Показывает одно и то же предложение
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="ai">
                    <Box>
                      <Typography>AI (Персонализация)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Подбирает предложение под пользователя
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Static mode */}
            {settings.mode === 'static' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>МФО для показа</InputLabel>
                  <Select
                    value={settings.staticMfoId}
                    label="МФО для показа"
                    onChange={(e) => updateSetting('staticMfoId', e.target.value)}
                  >
                    {MFO_OPTIONS.map(mfo => (
                      <MenuItem key={mfo.id} value={mfo.id}>{mfo.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* AI mode defaults */}
            {settings.mode === 'ai' && (
              <>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Сумма по умолчанию"
                    type="number"
                    value={settings.defaultAmount}
                    onChange={(e) => updateSetting('defaultAmount', parseInt(e.target.value))}
                    helperText="Если сумма не известна"
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Срок по умолчанию"
                    type="number"
                    value={settings.defaultTerm}
                    onChange={(e) => updateSetting('defaultTerm', parseInt(e.target.value))}
                    helperText="Если срок не известен"
                  />
                </Grid>
              </>
            )}

            {/* Device settings */}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Устройства
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.showOnDesktop}
                    onChange={(e) => updateSetting('showOnDesktop', e.target.checked)}
                  />
                }
                label="Показывать на ПК"
              />
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.showOnMobile}
                    onChange={(e) => updateSetting('showOnMobile', e.target.checked)}
                  />
                }
                label="Показывать на мобильных"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Порог прокрутки %"
                type="number"
                inputProps={{ min: 50, max: 95 }}
                value={settings.scrollThreshold}
                onChange={(e) => updateSetting('scrollThreshold', parseInt(e.target.value))}
                helperText="Процент прокрутки страницы для показа на мобильных"
              />
            </Grid>

            {/* Custom messages */}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Тексты сообщений
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Заголовок"
                value={settings.headline}
                onChange={(e) => updateSetting('headline', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Подзаголовок"
                value={settings.subheadline}
                onChange={(e) => updateSetting('subheadline', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
            >
              Сбросить
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            >
              Сохранить
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Предпросмотр
          </Typography>
          <Box sx={{ 
            p: 3, 
            bgcolor: '#f5f5f5', 
            borderRadius: 2,
            border: '2px dashed #ccc',
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Popup будет выглядеть так:
            </Typography>
            <Box sx={{ 
              maxWidth: 400, 
              mx: 'auto', 
              mt: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 2,
              boxShadow: 3
            }}>
              <Chip label={settings.enabled ? 'Включён' : 'Выключен'} size="small" sx={{ mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                {settings.headline}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {settings.subheadline}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2, color: '#4caf50', fontWeight: 700 }}>
                {settings.mode === 'ai' ? 'до 30 000 ₽' : 'до 30 000 ₽'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Режим: {settings.mode === 'ai' ? 'AI персонализация' : 'Статический'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
    </Box>
  )
}
