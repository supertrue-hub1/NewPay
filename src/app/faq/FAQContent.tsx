'use client'

import { useState, useEffect } from 'react'
import { Typography, Box, Paper, List, ListItemButton, ListItemText, Collapse } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { useFAQData, FAQ } from '@/data/faq'

interface FAQItemProps {
  faq: FAQ
  isActive: boolean
  onClick: () => void
}

function FAQItem({ faq, isActive, onClick }: FAQItemProps) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 1.5, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: isActive ? 'primary.main' : 'grey.200',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      <ListItemButton onClick={onClick} sx={{ py: 2, px: 3 }}>
        <ListItemText 
          primary={faq.question}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        />
        {isActive ? <ExpandLess color="primary" /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isActive}>
        <Box sx={{ px: 3, pb: 3, pt: 0 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {faq.answer}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  )
}

function generateFAQSchema(faqData: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }
}

export default function FAQContent() {
  const { faqData, isLoaded } = useFAQData()
  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    if (faqData.length > 0 && activeId === null) {
      setActiveId(faqData[0].id)
    }
  }, [faqData, activeId])

  if (!isLoaded) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">Загрузка...</Typography>
      </Box>
    )
  }

  const jsonLd = generateFAQSchema(faqData)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', position: 'sticky', top: 120 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Вопросы</Typography>
            <List dense disablePadding>
              {faqData.map((faq) => (
                <ListItemButton
                  key={faq.id}
                  selected={activeId === faq.id}
                  onClick={() => setActiveId(faq.id)}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.main' },
                    },
                  }}
                >
                  <ListItemText primary={faq.question} primaryTypographyProps={{ fontSize: 14, noWrap: true }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800, display: { xs: 'block', md: 'none' } }}>
            Частые вопросы
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, display: { xs: 'block', md: 'none' } }}>
            Нажмите на вопрос, чтобы увидеть ответ
          </Typography>
          {faqData.map((faq) => (
            <FAQItem key={faq.id} faq={faq} isActive={activeId === faq.id} onClick={() => setActiveId(activeId === faq.id ? null : faq.id)} />
          ))}
        </Box>
      </Box>
    </>
  )
}
