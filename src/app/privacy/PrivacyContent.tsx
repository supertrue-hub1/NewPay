'use client'

import { Typography, Paper, Box, CircularProgress } from '@mui/material'
import { useFooterData } from '@/components/Footer'

export default function PrivacyContent() {
  const { footerData, isLoaded } = useFooterData()

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'transparent' }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 800, color: '#1a237e' }}>
        Политика конфиденциальности
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary' }}>
        {footerData.privacyContent || 'Политика конфиденциальности не указана.'}
      </Typography>
    </Paper>
  )
}
