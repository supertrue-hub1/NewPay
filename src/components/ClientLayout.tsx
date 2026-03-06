'use client'

import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { usePathname } from 'next/navigation'
import ThemeRegistry from './ThemeRegistry'
import Header from './Header'
import UpperFooter from './UpperFooter'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <Box suppressHydrationWarning>
      <ThemeRegistry>
        {!isHomePage && <Header />}
        <UpperFooter />
        <Box sx={{ pt: isHomePage ? 0 : '100px' }}>
          {children}
        </Box>
        <Footer />
      </ThemeRegistry>
    </Box>
  )
}
