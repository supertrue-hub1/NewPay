'use client'

import { ReactNode } from 'react'
import { Box } from '@mui/material'
import ThemeRegistry from './ThemeRegistry'
import Header from './Header'
import UpperFooter from './UpperFooter'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: ReactNode }) {
 return (
 <Box suppressHydrationWarning>
 <ThemeRegistry>
 <Header />
 <UpperFooter />
 <Box sx={{ pt: '100px' }}>
 {children}
 </Box>
 <Footer />
 </ThemeRegistry>
 </Box>
 )
}

