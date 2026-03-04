'use client'

import { Box, Button, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface Props {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: Props) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4, mb: 2 }}>
      {/* Prev */}
      {currentPage > 1 && (
        <Button
          href={getPageUrl(currentPage - 1)}
          startIcon={<ArrowBackIosIcon sx={{ fontSize: 14 }} />}
          sx={{ 
            color: '#4f46e5', 
            border: '1px solid #e2e8f0', 
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { borderColor: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.04)' }
          }}
        >
          Назад
        </Button>
      )}

      {/* Page numbers */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {renderPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            page === currentPage ? (
              <Box
                key={idx}
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#4f46e5',
                  color: 'white',
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {page}
              </Box>
            ) : (
              <Button
                key={idx}
                href={getPageUrl(page)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#4f46e5', color: '#4f46e5' }
                }}
              >
                {page}
              </Button>
            )
          ) : (
            <Box key={idx} sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              {page}
            </Box>
          )
        ))}
      </Box>

      {/* Next */}
      {currentPage < totalPages && (
        <Button
          href={getPageUrl(currentPage + 1)}
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
          sx={{ 
            color: '#4f46e5', 
            border: '1px solid #e2e8f0', 
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { borderColor: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.04)' }
          }}
        >
          Далее
        </Button>
      )}
    </Box>
  )
}
