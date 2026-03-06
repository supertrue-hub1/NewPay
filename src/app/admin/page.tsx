'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, Box, Card, CardContent, Grid, TextField, Button, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, 
  FormControlLabel, Switch, LinearProgress, Divider, Paper,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { Delete, Edit, Add, Close, TrendingUp, Visibility, TouchApp, Lock } from '@mui/icons-material'
import { useMfoData, MFO } from '@/data/mfo'
import { useCardsData, CreditCard } from '@/data/cards'
import { useArticlesData, Article } from '@/data/articles'
import { useFAQData, FAQ } from '@/data/faq'
import { useAnalytics } from '@/data/analytics'
import { useFooterData } from '@/components/Footer'
import { useLoansInfo } from '@/data/loansInfo'
import { usePageData } from '@/data/pages'
import { usePromoCodesData, PromoCode } from '@/data/promokody'
import AdminLayout from '@/components/AdminLayout'
import Logo from '@/components/Logo'

// Константа пароля
const ADMIN_PASSWORD = '546815hH'

// Функция транслитерации для генерации slug
const transliterate = (text: string): string => {
  const ruToEn: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'yo',
    'Ж': 'zh', 'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm',
    'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u',
    'Ф': 'f', 'Х': 'h', 'Ц': 'ts', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch', 'Ъ': '',
    'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya',
    ' ': '-', '_': '-', '.': '-', ',': '-', '/': '-', '\\': '-',
    '|': '-', '(': '', ')': '', '[': '', ']': '', '{': '', '}': '',
    '<': '', '>': '', '"': '', "'": '', '`': '', '!': '', '?': '',
    '#': '', '$': '', '%': '', '^': '', '&': '', '*': '', '+': '=',
    '=': '-', '@': '', '~': '', ':': '-', ';': '-'
  }
  return text
    .split('')
    .map(char => ruToEn[char] || char)
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

type TabType = 'mfo' | 'mfoOverview' | 'cards' | 'blog' | 'faq' | 'promokody' | 'footer' | 'loansInfo' | 'analytics' | 'about' | 'terms'

// Категории статей
const ARTICLE_CATEGORIES = [
  'Советы',
  'Образование',
  'Сравнение',
  'Безопасность',
  'Новости',
  'Обзоры',
  'Рейтинги',
  'Гайды',
]

const emptyMfo: Omit<MFO, 'id'> = {
  name: '', logo: '', rating: 4.5, reviews: 0,
  sumMin: 1000, sumMax: 30000, termMin: 5, termMax: 30,
  percent: 0.8, firstFree: true, instant: true, badge: '', siteUrl: '', infoModal: '', seoDescription: '',
  pros: [], cons: [], risks: []
}

const emptyCard: Omit<CreditCard, 'id'> = {
  name: '', bank: '', logo: '', rating: 4.5, reviews: 0,
  cashback: 3, gracePeriod: 55, annualFee: 0, limit: 300000,
  percent: 12.9, badge: '', features: []
}

const emptyArticle: Omit<Article, 'id'> = {
  title: '', slug: '', excerpt: '', content: '',
  author: '', date: new Date().toISOString().split('T')[0], category: '', image: '', views: 0,
  seoTitle: '', seoDescription: '', seoOgImage: ''
}

const emptyFaq: Omit<FAQ, 'id'> = {
  question: '', answer: ''
}

const emptyPromoCode: Omit<PromoCode, 'id'> = {
  mfoName: '', logo: '', promoCode: '', discount: '', conditions: '', siteUrl: '', isExclusive: false
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('mfo')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>(emptyMfo)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Авторизация
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Проверка авторизации при загрузке
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
      setAuthError('')
    } else {
      setAuthError('Неверный пароль')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_auth')
    setPassword('')
  }

  // ВСЕ хуки должны вызываться ПЕРЕД условными return!
  const { mfoData, addMfo, updateMfo, deleteMfo } = useMfoData()
  const { cardsData, addCard, updateCard, deleteCard, resetCards } = useCardsData()
  const { articlesData, addArticle, updateArticle, deleteArticle, resetArticles } = useArticlesData()
  const { faqData, addFAQ, updateFAQ, deleteFAQ, resetFAQ } = useFAQData()
  const { footerData, updateFooterData, resetFooterData, isLoaded: footerLoaded } = useFooterData()
  const { loansInfo, updateLoansInfo, resetLoansInfo, isLoaded: loansInfoLoaded } = useLoansInfo()
  const { pageData, updateAbout, updateTerms, resetPageData } = usePageData()
  const { analytics, getConversionRate, resetAnalytics } = useAnalytics()
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode, resetPromoCodes, isLoaded: promoLoaded } = usePromoCodesData()

  // Показываем лоадер пока проверяем авторизацию
  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#1a237e' }}>
        <Typography color="white">Загрузка...</Typography>
      </Box>
    )
  }

  // Форма входа
  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: '#1a237e',
        p: 2
      }}>
        <Card sx={{ maxWidth: 400, width: '100%', p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Lock sx={{ fontSize: 48, color: '#1a237e', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Админ-панель
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Введите пароль для входа
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            error={!!authError}
            helperText={authError}
            sx={{ mb: 2 }}
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={handleLogin}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
          >
            Войти
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            Только для администраторов
          </Typography>
        </Card>
      </Box>
    )
  }

  const handleAdd = () => {
    setEditingItem(null)
    setSlugManuallyEdited(false)
    switch (activeTab) {
      case 'mfo': setFormData(emptyMfo); break
      case 'cards': setFormData(emptyCard); break
      case 'blog': setFormData(emptyArticle); break
      case 'faq': setFormData(emptyFaq); break
      case 'promokody': setFormData(emptyPromoCode); break
      case 'footer': setFormData(footerData); break
      case 'loansInfo': setFormData(loansInfo); break
      case 'about': setFormData(pageData.about); break
      case 'terms': setFormData(pageData.terms); break
    }
    setOpenDialog(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData(item)
    setSlugManuallyEdited(true)
    setOpenDialog(true)
  }

  const handleSave = () => {
    if (activeTab === 'mfo') {
      if (editingItem) updateMfo({ ...formData, id: editingItem.id })
      else addMfo(formData)
    } else if (activeTab === 'cards') {
      if (editingItem) updateCard({ ...formData, id: editingItem.id })
      else addCard(formData)
    } else if (activeTab === 'blog') {
      if (editingItem) updateArticle({ ...formData, id: editingItem.id })
      else addArticle(formData)
    } else if (activeTab === 'faq') {
      if (editingItem) updateFAQ({ ...formData, id: editingItem.id })
      else addFAQ(formData)
    } else if (activeTab === 'promokody') {
      if (editingItem) updatePromoCode({ ...formData, id: editingItem.id })
      else addPromoCode(formData)
    } else if (activeTab === 'footer') {
      updateFooterData(formData)
    } else if (activeTab === 'loansInfo') {
      updateLoansInfo(formData)
    } else if (activeTab === 'about') {
      updateAbout(formData)
    } else if (activeTab === 'terms') {
      updateTerms(formData)
    }
    setOpenDialog(false)
  }

  const handleReset = () => {
    if (activeTab === 'cards') resetCards()
    else if (activeTab === 'blog') resetArticles()
    else if (activeTab === 'faq') resetFAQ()
    else if (activeTab === 'promokody') resetPromoCodes()
    else if (activeTab === 'footer') resetFooterData()
    else if (activeTab === 'loansInfo') resetLoansInfo()
    else if (activeTab === 'analytics') resetAnalytics()
    else if (activeTab === 'about' || activeTab === 'terms') resetPageData()
  }

  const updateFormField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const sortedByClicks = [...mfoData].sort((a, b) => 
    (analytics.mfoClicks[b.id] || 0) - (analytics.mfoClicks[a.id] || 0)
  )

  return (
    <AdminLayout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'white' }}>Админ-панель</Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>Управление контентом сайта</Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleLogout}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Выйти
          </Button>
        </Box>

        {/* === Обзор МФО === */}
        {activeTab === 'mfoOverview' && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                Редактирование обзоров МФО
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                Здесь вы можете отредактировать дополнительную информацию для страниц обзоров: плюсы, минусы, риски и описание компании
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {mfoData.map((mfo) => (
                <Grid size={{ xs: 12, md: 6 }} key={mfo.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Logo logo={mfo.logo} size={40} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{mfo.name}</Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="success.main" sx={{ mb: 1, fontWeight: 600 }}>
                          Плюсы ({mfo.pros?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {mfo.pros?.slice(0, 2).join(', ') || 'Не задано'}
                          {(mfo.pros?.length || 0) > 2 && '...'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="error.main" sx={{ mb: 1, fontWeight: 600 }}>
                          Минусы ({mfo.cons?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {mfo.cons?.slice(0, 2).join(', ') || 'Не задано'}
                          {(mfo.cons?.length || 0) > 2 && '...'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1, fontWeight: 600 }}>
                          Риски ({mfo.risks?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {mfo.risks?.slice(0, 2).join(', ') || 'Не задано'}
                          {(mfo.risks?.length || 0) > 2 && '...'}
                        </Typography>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<Edit />}
                        onClick={() => {
                          setEditingItem(mfo)
                          setFormData(mfo)
                          setSlugManuallyEdited(true)
                          setActiveTab('mfo')
                        }}
                      >
                        Редактировать
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* === МФО === */}
        {activeTab === 'mfo' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить МФО</Button>
            </Box>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
<TableHead><TableRow>
                      <TableCell>Лого</TableCell><TableCell>Название</TableCell><TableCell>Рейтинг</TableCell>
                      <TableCell>Сумма</TableCell><TableCell>Срок</TableCell>
                      <TableCell>Ставка</TableCell><TableCell>Действия</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {mfoData.map((mfo) => (
                        <TableRow key={mfo.id}>
<TableCell><Logo logo={mfo.logo} size={40} /></TableCell>
                          <TableCell>{mfo.name}</TableCell><TableCell>{mfo.rating}</TableCell>
                          <TableCell>{mfo.sumMin} - {mfo.sumMax}</TableCell>
                          <TableCell>{mfo.termMin} - {mfo.termMax}</TableCell>
                          <TableCell>{mfo.percent}%</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(mfo)}><Edit /></IconButton>
                            <IconButton onClick={() => deleteMfo(mfo.id)} color="error"><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Карты === */}
        {activeTab === 'cards' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить карту</Button>
            </Box>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead><TableRow>
                      <TableCell>Название</TableCell><TableCell>Банк</TableCell>
                      <TableCell>Кэшбэк</TableCell><TableCell>Грейс</TableCell>
                      <TableCell>Лимит</TableCell><TableCell>Действия</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {cardsData.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell>{card.name}</TableCell><TableCell>{card.bank}</TableCell>
                          <TableCell>{card.cashback}%</TableCell><TableCell>{card.gracePeriod} дн.</TableCell>
                          <TableCell>{card.limit.toLocaleString()} ₽</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(card)}><Edit /></IconButton>
                            <IconButton onClick={() => deleteCard(card.id)} color="error"><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Блог === */}
        {activeTab === 'blog' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить статью</Button>
            </Box>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead><TableRow>
                      <TableCell>Заголовок</TableCell><TableCell>Категория</TableCell>
                      <TableCell>SEO</TableCell><TableCell>Просмотры</TableCell><TableCell>Дата</TableCell><TableCell>Действия</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {articlesData.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>{article.title}</TableCell>
                          <TableCell><Chip label={article.category} size="small" /></TableCell>
                          <TableCell>
                            {article.seoTitle ? <Chip label="SEO" size="small" color="success" /> : <Chip label="Нет" size="small" />}
                          </TableCell>
                          <TableCell>{article.views?.toLocaleString() || 0}</TableCell>
                          <TableCell>{new Date(article.date).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(article)}><Edit /></IconButton>
                            <IconButton onClick={() => deleteArticle(article.id)} color="error"><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* === FAQ === */}
        {activeTab === 'faq' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить FAQ</Button>
            </Box>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead><TableRow>
                      <TableCell>Вопрос</TableCell><TableCell>Ответ</TableCell><TableCell>Действия</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {faqData.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell sx={{ maxWidth: 300 }}>{faq.question}</TableCell>
                          <TableCell sx={{ maxWidth: 400 }}>{faq.answer}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(faq)}><Edit /></IconButton>
                            <IconButton onClick={() => deleteFAQ(faq.id)} color="error"><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Промокоды === */}
        {activeTab === 'promokody' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Добавить промокод</Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить</Button>
            </Box>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead><TableRow>
                      <TableCell>МФО</TableCell><TableCell>Лого</TableCell>
                      <TableCell>Промокод</TableCell><TableCell>Скидка</TableCell>
                      <TableCell>Условия</TableCell><TableCell>URL</TableCell><TableCell>Действия</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {promoCodes.map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell>{promo.mfoName}</TableCell>
                          <TableCell>{promo.logo}</TableCell>
                          <TableCell><Chip label={promo.promoCode} size="small" color="primary" /></TableCell>
                          <TableCell>{promo.discount}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>{promo.conditions}</TableCell>
                          <TableCell>{promo.siteUrl}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(promo)}><Edit /></IconButton>
                            <IconButton onClick={() => deletePromoCode(promo.id)} color="error"><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Footer === */}
        {activeTab === 'footer' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => {
                  setEditingItem(footerData)
                  setFormData(footerData)
                  setOpenDialog(true)
                }}
                disabled={!footerLoaded}
              >
                Редактировать
              </Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить</Button>
            </Box>
            {!footerLoaded ? (
              <Card><CardContent><Typography>Загрузка данных...</Typography></CardContent></Card>
            ) : (
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Описание</Typography>
                      <Typography variant="body1">{footerData.about}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Контакты</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}><strong>Телефон:</strong> {footerData.phone}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}><strong>Email:</strong> {footerData.email}</Typography>
                      <Typography variant="body2"><strong>Адрес:</strong> {footerData.address}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Информационные ссылки</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}><strong>Политика конфиденциальности:</strong> {footerData.privacyPolicy}</Typography>
                      <Typography variant="body2"><strong>Оферта:</strong> {footerData.offer}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Социальные сети</Typography>
                      {footerData.socialLinks?.facebook && <Typography variant="body2" sx={{ mb: 1 }}>Facebook: {footerData.socialLinks.facebook}</Typography>}
                      {footerData.socialLinks?.twitter && <Typography variant="body2" sx={{ mb: 1 }}>Twitter: {footerData.socialLinks.twitter}</Typography>}
                      {footerData.socialLinks?.instagram && <Typography variant="body2" sx={{ mb: 1 }}>Instagram: {footerData.socialLinks.instagram}</Typography>}
                      {footerData.socialLinks?.telegram && <Typography variant="body2">Telegram: {footerData.socialLinks.telegram}</Typography>}
                      {!footerData.socialLinks?.facebook && !footerData.socialLinks?.twitter && !footerData.socialLinks?.instagram && !footerData.socialLinks?.telegram && (
                        <Typography variant="body2" color="text.secondary">Социальные сети не добавлены</Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* === Информация о займах === */}
        {activeTab === 'loansInfo' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => {
                  setEditingItem(loansInfo)
                  setFormData(loansInfo)
                  setOpenDialog(true)
                }}
                disabled={!loansInfoLoaded}
              >
                Редактировать
              </Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить</Button>
            </Box>
            {!loansInfoLoaded ? (
              <Card><CardContent><Typography>Загрузка данных...</Typography></CardContent></Card>
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {loansInfo.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                    {loansInfo.content}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>Разделы FAQ</Typography>
                  {loansInfo.sections.map((section, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {section.title}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {section.content}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* === Аналитика === */}
        {activeTab === 'analytics' && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Visibility color="primary" />
                    <Typography variant="h6">Просмотры</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>{analytics.totalViews}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TouchApp color="primary" />
                    <Typography variant="h6">Заявки</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>{analytics.totalApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6">Конверсия</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {analytics.totalViews > 0 ? Math.round((analytics.totalApplications / analytics.totalViews) * 100) : 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Клики по МФО</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow>
                        <TableCell>МФО</TableCell><TableCell>Клики</TableCell>
                        <TableCell>Конверсии</TableCell><TableCell>Конверсия %</TableCell>
                        <TableCell>Визуализация</TableCell>
                      </TableRow></TableHead>
                      <TableBody>
                        {sortedByClicks.map((mfo) => {
                          const clicks = analytics.mfoClicks[mfo.id] || 0
                          const conversions = analytics.mfoConversions[mfo.id] || 0
                          const rate = getConversionRate(mfo.id)
                          const maxClicks = Math.max(...Object.values(analytics.mfoClicks), 1)
                          return (
                            <TableRow key={mfo.id}>
                              <TableCell sx={{ fontWeight: 600 }}>{mfo.name}</TableCell>
                              <TableCell>{clicks}</TableCell>
                              <TableCell>{conversions}</TableCell>
                              <TableCell>
                                <Chip label={`${rate}%`} size="small" color={rate > 20 ? 'success' : rate > 10 ? 'warning' : 'default'} />
                              </TableCell>
                              <TableCell sx={{ width: 200 }}>
                                <LinearProgress variant="determinate" value={(clicks / maxClicks) * 100} sx={{ height: 10, borderRadius: 5 }} />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Популярные суммы</Typography>
                  {Object.entries(analytics.popularFilters.sumRanges).length > 0 ? (
                    Object.entries(analytics.popularFilters.sumRanges)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([range, count]) => (
                        <Box key={range} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography>{range}</Typography>
                            <Typography fontWeight={600}>{count}</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      ))
                  ) : (
                    <Typography color="text.secondary">Нет данных</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Популярные сроки</Typography>
                  {Object.entries(analytics.popularFilters.termRanges).length > 0 ? (
                    Object.entries(analytics.popularFilters.termRanges)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([term, count]) => (
                        <Box key={term} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography>{term}</Typography>
                            <Typography fontWeight={600}>{count}</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      ))
                  ) : (
                    <Typography color="text.secondary">Нет данных</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить аналитику</Button>
            </Grid>
          </Grid>
        )}

        {/* === О нас === */}
        {activeTab === 'about' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => {
                  setEditingItem(pageData.about)
                  setFormData(pageData.about)
                  setOpenDialog(true)
                }}
              >
                Редактировать
              </Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить</Button>
            </Box>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  {pageData.about.title}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {pageData.about.content}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Пользовательское соглашение === */}
        {activeTab === 'terms' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => {
                  setEditingItem(pageData.terms)
                  setFormData(pageData.terms)
                  setOpenDialog(true)
                }}
              >
                Редактировать
              </Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>Сбросить</Button>
            </Box>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  Пользовательское соглашение
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {pageData.terms.content}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* === Модальное окно === */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {activeTab === 'footer' ? (editingItem ? 'Редактирование' : 'Настройка') + ' футера' : 
              activeTab === 'loansInfo' ? 'Редактирование информации о займах' :
              activeTab === 'about' ? 'Редактирование страницы "О нас"' :
              activeTab === 'terms' ? 'Редактирование пользовательского соглашения' :
              (editingItem ? 'Редактирование' : 'Добавление') + ' ' + (
                activeTab === 'mfo' ? 'МФО' : 
                activeTab === 'cards' ? 'карты' : 
                activeTab === 'blog' ? 'статьи' : 
                activeTab === 'promokody' ? 'промокода' : 'FAQ'
              )
            }
            <IconButton onClick={() => setOpenDialog(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* МФО */}
              {activeTab === 'mfo' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Название" value={formData.name} onChange={(e) => updateFormField('name', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2, textAlign: 'center' }}>
                      {formData.logo ? (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, mx: 'auto', mb: 1 }}>{formData.logo}</Box>
                          <Typography variant="caption" display="block" color="text.secondary">{formData.logo}</Typography>
                        </Box>
                      ) : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Логотип не загружен</Typography>}
                      <Button variant="outlined" component="label" size="small">Загрузить лого<input type="file" accept="image/*" hidden onChange={(e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) updateFormField('logo', file.name) }} /></Button>
                    </Box>
                    <TextField fullWidth label="Или загрузка лого по URL" size="small" sx={{ mt: 1 }} value={formData.logo?.startsWith('http') ? formData.logo : ''} onChange={(e) => updateFormField('logo', e.target.value)} placeholder="https://example.com/logo.png" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Рейтинг" type="number" inputProps={{ step: 0.1 }} value={formData.rating} onChange={(e) => updateFormField('rating', parseFloat(e.target.value))} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Отзывы" type="number" value={formData.reviews} onChange={(e) => updateFormField('reviews', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Сумма мин." type="number" value={formData.sumMin} onChange={(e) => updateFormField('sumMin', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Сумма макс." type="number" value={formData.sumMax} onChange={(e) => updateFormField('sumMax', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Срок мин." type="number" value={formData.termMin} onChange={(e) => updateFormField('termMin', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Срок макс." type="number" value={formData.termMax} onChange={(e) => updateFormField('termMax', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Ставка %" type="number" inputProps={{ step: 0.1 }} value={formData.percent} onChange={(e) => updateFormField('percent', parseFloat(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Бейдж" value={formData.badge} onChange={(e) => updateFormField('badge', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="URL сайта" value={formData.siteUrl} onChange={(e) => updateFormField('siteUrl', e.target.value)} placeholder="https://example.com" InputProps={{ endAdornment: formData.siteUrl ? <Button size="small" href={formData.siteUrl} target="_blank" rel="noopener noreferrer">Открыть</Button> : null }} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Описание" multiline rows={2} value={formData.infoModal} onChange={(e) => updateFormField('infoModal', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="SEO-подпись (для карточки)" value={formData.seoDescription || ''} onChange={(e) => updateFormField('seoDescription', e.target.value)} placeholder="Первый займ 0% • Одобрение за 2 минуты" helperText="Отображается под названием МФО вместо рейтинга и отзывов" /></Grid>
                  
                  {/* Дополнительные поля "О компании" */}
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>О компании</Typography></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="ИНН" value={formData.inn || ''} onChange={(e) => updateFormField('inn', e.target.value)} placeholder="1234567890" /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="ОГРН" value={formData.ogrn || ''} onChange={(e) => updateFormField('ogrn', e.target.value)} placeholder="1234567890123" /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Лицензия" value={formData.license || ''} onChange={(e) => updateFormField('license', e.target.value)} placeholder="ЦБ РФ № 1234567890123" /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Адрес" value={formData.address || ''} onChange={(e) => updateFormField('address', e.target.value)} placeholder="г. Москва, ул. Примерная, д. 1" /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Телефон" value={formData.phone || ''} onChange={(e) => updateFormField('phone', e.target.value)} placeholder="+7 (495) 123-45-67" /></Grid>
                  
<Grid size={{ xs: 6 }}><FormControlLabel control={<Switch checked={formData.firstFree} onChange={(e) => updateFormField('firstFree', e.target.checked)} />} label="Первый займ 0%" /></Grid>
                  <Grid size={{ xs: 6 }}><FormControlLabel control={<Switch checked={formData.instant} onChange={(e) => updateFormField('instant', e.target.checked)} />} label="Мгновенно" /></Grid>
                </>
              )}

              {/* Карты */}
              {activeTab === 'cards' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Название" value={formData.name} onChange={(e) => updateFormField('name', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Банк" value={formData.bank} onChange={(e) => updateFormField('bank', e.target.value)} /></Grid>
                  
                  {/* Логотип карты - загрузка и URL */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2, textAlign: 'center' }}>
                      {formData.logo ? (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ width: 60, height: 40, borderRadius: 1, bgcolor: '#e53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, mx: 'auto', mb: 1 }}>
                            {formData.logo}
                          </Box>
                          <Typography variant="caption" display="block" color="text.secondary">{formData.logo}</Typography>
                        </Box>
                      ) : <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Логотип не загружен</Typography>}
                      <Button variant="outlined" component="label" size="small">Загрузить лого<input type="file" accept="image/*" hidden onChange={(e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) updateFormField('logo', file.name) }} /></Button>
                    </Box>
                    <TextField fullWidth label="Или загрузка лого по URL" size="small" sx={{ mt: 1 }} value={formData.logo?.startsWith('http') ? formData.logo : ''} onChange={(e) => updateFormField('logo', e.target.value)} placeholder="https://example.com/logo.png" />
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Рейтинг" type="number" inputProps={{ step: 0.1 }} value={formData.rating} onChange={(e) => updateFormField('rating', parseFloat(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Кэшбэк %" type="number" value={formData.cashback} onChange={(e) => updateFormField('cashback', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Грейс-период" type="number" value={formData.gracePeriod} onChange={(e) => updateFormField('gracePeriod', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Годовая плата" type="number" value={formData.annualFee} onChange={(e) => updateFormField('annualFee', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Лимит" type="number" value={formData.limit} onChange={(e) => updateFormField('limit', parseInt(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Ставка %" type="number" inputProps={{ step: 0.1 }} value={formData.percent} onChange={(e) => updateFormField('percent', parseFloat(e.target.value))} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Бейдж" value={formData.badge} onChange={(e) => updateFormField('badge', e.target.value)} /></Grid>
                  
                  {/* URL сайта банка */}
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Сайт банка" value={formData.siteUrl || ''} onChange={(e) => updateFormField('siteUrl', e.target.value)} placeholder="https://bank.ru" InputProps={{ endAdornment: formData.siteUrl ? <Button size="small" href={formData.siteUrl} target="_blank" rel="noopener noreferrer">Открыть</Button> : null }} />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Особенности (через запятую)" value={formData.features?.join(', ')} onChange={(e) => updateFormField('features', e.target.value.split(', '))} /></Grid>
                </>
              )}

              {/* Блог - Статьи с SEO */}
              {activeTab === 'blog' && (
                <>
                  {/* Загрузка обложки статьи */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Обложка статьи</Typography>
                    <Box sx={{ border: '2px dashed #1976d2', borderRadius: 2, p: 1, textAlign: 'center', bgcolor: '#f5f8ff', overflow: 'hidden' }}>
                      {formData.image ? (
                        <Box sx={{ width: '100%', maxWidth: 400, height: { xs: 120, sm: 160, md: 200 }, mx: 'auto', overflow: 'hidden', borderRadius: 1, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Box 
                            component="img"
                            src={
                              formData.image.startsWith('data:') ? formData.image :
                              formData.image.startsWith('http') ? formData.image :
                              `/images/${formData.image}`
                            }
                            alt="Обложка"
                            sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Изображение не загружено
                        </Typography>
                      )}
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, wordBreak: 'break-all' }}>
                        {formData.image && typeof formData.image === 'string' && formData.image.length > 60 ? formData.image.substring(0, 60) + '...' : formData.image}
                      </Typography>
                      <Button 
                        variant="contained" 
                        component="label"
                        startIcon={<Add />}
                      >
                        Загрузить изображение
                        <input 
                          type="file" 
                          accept="image/*" 
                          hidden 
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                updateFormField('image', event.target?.result as string)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </Button>
                    </Box>
                    <TextField 
                      fullWidth 
                      label="Или URL изображения" 
                      size="small" 
                      sx={{ mt: 2 }}
                      value={formData.image?.startsWith('http') ? formData.image : ''} 
                      onChange={(e) => updateFormField('image', e.target.value)} 
                      placeholder="https://example.com/image.jpg"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}><TextField 
                    fullWidth 
                    label="Заголовок" 
                    value={formData.title} 
                    onChange={(e) => {
                      updateFormField('title', e.target.value)
                      if (!slugManuallyEdited) {
                        updateFormField('slug', transliterate(e.target.value))
                      }
                    }} 
                  /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField 
                    fullWidth 
                    label="Slug" 
                    value={formData.slug} 
                    onChange={(e) => {
                      setSlugManuallyEdited(true)
                      updateFormField('slug', e.target.value)
                    }} 
                    placeholder="kak-vybrat-zajm" 
                    helperText="Заполняется автоматически из заголовка"
                  /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Категория</InputLabel>
                      <Select
                        value={formData.category || ''}
                        label="Категория"
                        onChange={(e) => updateFormField('category', e.target.value)}
                      >
                        {ARTICLE_CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Автор" value={formData.author} onChange={(e) => updateFormField('author', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Дата" type="date" value={formData.date} onChange={(e) => updateFormField('date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Краткое описание" multiline rows={2} value={formData.excerpt} onChange={(e) => updateFormField('excerpt', e.target.value)} /></Grid>

                  {/* SEO поля */}
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>SEO настройки</Typography></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="SEO Title" value={formData.seoTitle || ''} onChange={(e) => updateFormField('seoTitle', e.target.value)} placeholder="Купить займ онлайн - лучшие условия" helperText="Заголовок страницы (60-70 символов)" /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="SEO Description" value={formData.seoDescription || ''} onChange={(e) => updateFormField('seoDescription', e.target.value)} placeholder="Получите займ на карту за 5 минут..." helperText="Описание для поисковиков (150-160 символов)" multiline rows={2} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="OG Image URL" value={formData.seoOgImage || ''} onChange={(e) => updateFormField('seoOgImage', e.target.value)} placeholder="https://example.com/og-image.jpg" helperText="Изображение для соцсетей (1200x630)" /></Grid>
                  
                  {/* Редактор контента */}
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2 }}>Контент статьи</Typography></Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Поддерживается Markdown: ## Заголовок, **жирный**, *курсив*, - список</Typography>
                    <TextField fullWidth label="Контент" multiline rows={12} value={formData.content} onChange={(e) => updateFormField('content', e.target.value)} placeholder={`## Заголовок\n\nТекст...\n\n### Подзаголовок\n\n- Пункт 1\n- Пункт 2`} />
                  </Grid>
                </>
              )}

              {/* FAQ */}
              {activeTab === 'faq' && (
                <>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Вопрос" value={formData.question} onChange={(e) => updateFormField('question', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Ответ" multiline rows={4} value={formData.answer} onChange={(e) => updateFormField('answer', e.target.value)} /></Grid>
                </>
              )}

              {/* Промокоды */}
              {activeTab === 'promokody' && (
                <>
                  {/* Загрузка логотипа */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Логотип МФО</Typography>
                    <Box sx={{ border: '2px dashed #4f46e5', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: '#f5f8ff' }}>
                      {formData.logo ? (
                        <Box sx={{ mb: 2 }}>
                          <Box 
                            component="img"
                            src={formData.logo.startsWith('data:') ? formData.logo : formData.logo.startsWith('http') ? formData.logo : `/images/${formData.logo}`}
                            alt="Логотип"
                            sx={{ width: 80, height: 80, borderRadius: 2, mx: 'auto', objectFit: 'contain', bgcolor: 'white', p: 1 }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                            {typeof formData.logo === 'string' && formData.logo.length > 50 ? formData.logo.substring(0, 50) + '...' : formData.logo}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Логотип не загружен
                        </Typography>
                      )}
                      <Button 
                        variant="contained" 
                        component="label"
                        startIcon={<Add />}
                      >
                        Загрузить логотип
                        <input 
                          type="file" 
                          accept="image/*,.svg" 
                          hidden 
                          onChange={(e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                updateFormField('logo', event.target?.result as string)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </Button>
                    </Box>
                    <TextField 
                      fullWidth 
                      label="Или URL логотипа" 
                      size="small" 
                      sx={{ mt: 2 }}
                      value={formData.logo?.startsWith('http') ? formData.logo : ''} 
                      onChange={(e) => updateFormField('logo', e.target.value)} 
                      placeholder="https://example.com/logo.png или https://example.com/logo.svg"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Название МФО" value={formData.mfoName || ''} onChange={(e) => updateFormField('mfoName', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Промокод" value={formData.promoCode || ''} onChange={(e) => updateFormField('promoCode', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Скидка" value={formData.discount || ''} onChange={(e) => updateFormField('discount', e.target.value)} placeholder="Например: 1000₽ или 50%" /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Условия" multiline rows={3} value={formData.conditions || ''} onChange={(e) => updateFormField('conditions', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="URL сайта" value={formData.siteUrl || ''} onChange={(e) => updateFormField('siteUrl', e.target.value)} placeholder="https://example.com" /></Grid>
                  <Grid size={{ xs: 12 }}><FormControlLabel control={<Switch checked={formData.isExclusive || false} onChange={(e) => updateFormField('isExclusive', e.target.checked)} />} label="Эксклюзивный промокод" /></Grid>
                </>
              )}

              {/* Footer */}
              {activeTab === 'footer' && (
                <>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Описание о компании" multiline rows={3} value={formData.about || ''} onChange={(e) => updateFormField('about', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Телефон" value={formData.phone || ''} onChange={(e) => updateFormField('phone', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Email" value={formData.email || ''} onChange={(e) => updateFormField('email', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Адрес" value={formData.address || ''} onChange={(e) => updateFormField('address', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Политика конфиденциальности (текст ссылки)" value={formData.privacyPolicy || ''} onChange={(e) => updateFormField('privacyPolicy', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Оферта (текст ссылки)" value={formData.offer || ''} onChange={(e) => updateFormField('offer', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2 }}>Текст политики конфиденциальности</Typography></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Политика конфиденциальности (полный текст)" multiline rows={8} value={formData.privacyContent || ''} onChange={(e) => updateFormField('privacyContent', e.target.value)} helperText="Этот текст будет отображаться на странице /privacy" /></Grid>
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2 }}>Информация о cookies</Typography></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Текст о cookies" multiline rows={3} value={formData.cookieInfo || ''} onChange={(e) => updateFormField('cookieInfo', e.target.value)} helperText="Текст об использовании cookies, отображается в футере" /></Grid>
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2 }}>Социальные сети</Typography></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Facebook URL" value={formData.socialLinks?.facebook || ''} onChange={(e) => updateFormField('socialLinks', { ...formData.socialLinks, facebook: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Twitter URL" value={formData.socialLinks?.twitter || ''} onChange={(e) => updateFormField('socialLinks', { ...formData.socialLinks, twitter: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Instagram URL" value={formData.socialLinks?.instagram || ''} onChange={(e) => updateFormField('socialLinks', { ...formData.socialLinks, instagram: e.target.value })} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Telegram URL" value={formData.socialLinks?.telegram || ''} onChange={(e) => updateFormField('socialLinks', { ...formData.socialLinks, telegram: e.target.value })} /></Grid>
                </>
              )}

              {/* Информация о займах */}
              {activeTab === 'loansInfo' && (
                <>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Заголовок раздела" value={formData.title || ''} onChange={(e) => updateFormField('title', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Основной контент" multiline rows={6} value={formData.content || ''} onChange={(e) => updateFormField('content', e.target.value)} helperText="Основной текст под заголовком" /></Grid>
                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ mb: 2 }}>Разделы FAQ</Typography></Grid>
                  {[0, 1, 2, 3].map((index) => (
                    <Grid size={{ xs: 12 }} key={index}>
                      <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Раздел {index + 1}</Typography>
                        <TextField 
                          fullWidth 
                          label="Заголовок раздела" 
                          size="small"
                          sx={{ mb: 1 }}
                          value={formData.sections?.[index]?.title || ''} 
                          onChange={(e) => {
                            const newSections = [...(formData.sections || [])]
                            newSections[index] = { ...newSections[index], title: e.target.value }
                            updateFormField('sections', newSections)
                          }} 
                        />
                        <TextField 
                          fullWidth 
                          label="Содержание раздела" 
                          multiline 
                          rows={3}
                          size="small"
                          value={formData.sections?.[index]?.content || ''} 
                          onChange={(e) => {
                            const newSections = [...(formData.sections || [])]
                            newSections[index] = { ...newSections[index], content: e.target.value }
                            updateFormField('sections', newSections)
                          }} 
                        />
                      </Paper>
                    </Grid>
                  ))}
                </>
              )}

              {/* О нас */}
              {activeTab === 'about' && (
                <>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Заголовок" value={formData.title || ''} onChange={(e) => updateFormField('title', e.target.value)} /></Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel 
                      control={<Switch checked={formData.isHtml || false} onChange={(e) => updateFormField('isHtml', e.target.checked)} />} 
                      label="Использовать HTML" 
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField 
                      fullWidth 
                      label="Содержание" 
                      multiline 
                      rows={12} 
                      value={formData.content || ''} 
                      onChange={(e) => updateFormField('content', e.target.value)} 
                      helperText={formData.isHtml ? "Поддерживается HTML: <h1>, <p>, <ul>, <li>, <a>, <strong>" : "Текст будет отображаться с переносами строк. Включите HTML для форматирования."}
                    />
                    {formData.isHtml && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Пример HTML: &lt;h1&gt;Заголовок&lt;/h1&gt;, &lt;p&gt;Текст параграфа&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ul&gt;, &lt;a href="url"&gt;Ссылка&lt;/a&gt;
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </>
              )}

              {/* Пользовательское соглашение */}
              {activeTab === 'terms' && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel 
                      control={<Switch checked={formData.isHtml || false} onChange={(e) => updateFormField('isHtml', e.target.checked)} />} 
                      label="Использовать HTML" 
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField 
                      fullWidth 
                      label="Содержание" 
                      multiline 
                      rows={16} 
                      value={formData.content || ''} 
                      onChange={(e) => updateFormField('content', e.target.value)} 
                      helperText={formData.isHtml ? "Поддерживается HTML: <h1>, <h2>, <p>, <ul>, <li>, <a>, <strong>" : "Текст будет отображаться с переносами строк. Включите HTML для форматирования."}
                    />
                    {formData.isHtml && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Пример HTML: &lt;h2&gt;Раздел&lt;/h2&gt;, &lt;p&gt;Текст&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ul&gt;
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
            <Button variant="contained" onClick={handleSave}>Сохранить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  )
}
