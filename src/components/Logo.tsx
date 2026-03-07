'use client'

import { Box } from '@mui/material'

interface LogoProps {
  logo: string
  size?: number
  color?: string
}

export default function Logo({ logo, size = 60, color = '#1a237e' }: LogoProps) {
  // Check if logo is a URL (http/https), data URI (base64), or relative path (/images/)
  const isImage = logo && (
    logo.startsWith('http') || 
    logo.startsWith('https') || 
    logo.startsWith('data:') ||
    logo.startsWith('/images/') ||
    logo.startsWith('/api/')
  )

  if (isImage) {
    return (
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: size,
            height: size,
            borderRadius: 1,
            objectFit: 'contain',
            bgcolor: 'white',
            p: 0.5,
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.display = 'none'
            const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        {/* Fallback - show first letter if image fails */}
        <Box
          className="logo-fallback"
          sx={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: 1,
            bgcolor: color,
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: size * 0.4,
          }}
        >
          {logo?.charAt(0).toUpperCase()}
        </Box>
      </Box>
    )
  }

  // Render as text letter
  return (
    <Box
      className="logo-fallback"
      sx={{
        width: size,
        height: size,
        borderRadius: 1,
        bgcolor: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {logo}
    </Box>
  )
}
