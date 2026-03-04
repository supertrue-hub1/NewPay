'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ReactNode, useMemo } from 'react'

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#1a237e',
          },
          secondary: {
            main: '#4caf50',
          },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
