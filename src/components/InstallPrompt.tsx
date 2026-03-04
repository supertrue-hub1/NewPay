'use client'

import { useState, useEffect } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from '@mui/material'
import { InstallMobile } from '@mui/icons-material'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if dialog was previously dismissed
    const installDialogDismissed = localStorage.getItem('installDialogDismissed')
    if (!installDialogDismissed && !isInstalled) {
      // Show dialog automatically after 3 seconds
      setTimeout(() => {
        if (deferredPrompt) {
          setShowDialog(true)
        }
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [deferredPrompt, isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowDialog(false)
    localStorage.setItem('installDialogDismissed', 'true')
  }

  const handleDismiss = () => {
    setShowDialog(false)
    localStorage.setItem('installDialogDismissed', 'true')
  }

  if (isInstalled) {
    return null
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<InstallMobile />}
        onClick={() => setShowDialog(true)}
        sx={{
          borderColor: 'rgba(255,255,255,0.3)',
          color: 'white',
          '&:hover': {
            borderColor: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        Установить
      </Button>

      <Dialog open={showDialog} onClose={handleDismiss} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <InstallMobile sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6">Установить приложение</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Добавьте NewPay.ru на главный экран для быстрого доступа к займам!
          </Typography>
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <img 
              src="/header.svg" 
              alt="NewPay" 
              style={{ height: 40 }} 
            />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight="bold">NewPay.ru</Typography>
              <Typography variant="caption" color="text.secondary">
                Займы онлайн за 5 минут
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 1 }}>
          <Button onClick={handleDismiss} color="inherit">
            Не сейчас
          </Button>
          <Button 
            onClick={handleInstall} 
            variant="contained" 
            disabled={!deferredPrompt}
          >
            Установить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
