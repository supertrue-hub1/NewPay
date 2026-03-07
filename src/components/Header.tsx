'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Close, KeyboardArrowDown, LocationOn, MyLocation, Check, Close as CloseIcon } from '@mui/icons-material'
import { Snackbar, Alert } from '@mui/material'
import styles from './Header.module.css'

// Список популярных городов России
const POPULAR_CITIES = [
  { name: 'Москва', region: 'Москва и область', slug: 'moskva' },
  { name: 'Санкт-Петербург', region: 'Ленинградская область', slug: 'sankt-peterburg' },
  { name: 'Новосибирск', region: 'Новосибирская область', slug: 'novosibirsk' },
  { name: 'Екатеринбург', region: 'Свердловская область', slug: 'ekaterinburg' },
  { name: 'Казань', region: 'Республика Татарстан', slug: 'kazan' },
  { name: 'Нижний Новгород', region: 'Нижегородская область', slug: 'nizhny_novgorod' },
  { name: 'Челябинск', region: 'Челябинская область', slug: 'chelyabinsk' },
  { name: 'Самара', region: 'Самарская область', slug: 'samara' },
  { name: 'Омск', region: 'Омская область', slug: 'omsk' },
  { name: 'Ростов-на-Дону', region: 'Ростовская область', slug: 'rostov_na_donu' },
  { name: 'Уфа', region: 'Республика Башкортостан', slug: 'ufa' },
  { name: 'Воронеж', region: 'Воронежская область', slug: 'voronezh' },
  { name: 'Пермь', region: 'Пермский край', slug: 'perm' },
  { name: 'Волгоград', region: 'Волгоградская область', slug: 'volgograd' },
  { name: 'Красноярск', region: 'Красноярский край', slug: 'krasnoyarsk' },
]

interface NavItem {
  label: string
  href: string
  subitems?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { 
    label: 'Займы', 
    href: '/allmfo',
    subitems: [
      { label: 'Все займы', href: '/allmfo' },
      { label: 'Сравнить займы', href: '/mfo' },
      { label: 'Займы онлайн', href: '/zajmy-online' },
      { label: 'Займы по городам', href: '/zajmy-online/moskva' },
    ]
  },
  { label: 'Кредитные карты', href: '/cards' },
  { label: 'Статьи', href: '/articles' },
  { label: 'FAQ', href: '/faq' },
  { 
    label: 'Ещё', 
    href: '#',
    subitems: [
      { label: 'Отзывы', href: '/reviews' },
      { label: 'Жалоба в ЦБ РФ', href: '/complaint-cb' },
      { label: 'Нелегальные кредиторы', href: '/illegal-lenders' },
    ]
  },
]

export default function Header() {
  const pathname = usePathname() ?? '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Город
  const [selectedCity, setSelectedCity] = useState<{ name: string; region: string; slug: string } | null>(null)
  const [cityModalOpen, setCityModalOpen] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' })

  // Загрузка города из localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      try {
        setSelectedCity(JSON.parse(savedCity))
      } catch (e) {
        console.error('Error parsing city:', e)
      }
    }
    setMounted(true)
  }, [])

  // Сохранение города в localStorage
  const handleCitySelect = (city: { name: string; region: string; slug: string }) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', JSON.stringify(city))
    setCityModalOpen(false)
    setToast({ open: true, message: `Город изменён на ${city.name}`, severity: 'success' })
  }

  // Автоматическое определение города по IP
  const detectCity = async () => {
    setIsDetecting(true)
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        const cityName = data.city || data.region || 'Москва'
        
        // Ищем город в списке или создаём новый
        const foundCity = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase())
        const newCity = foundCity || { name: cityName, region: data.region || '', slug: cityName.toLowerCase().replace(/\s+/g, '_') }
        
        setSelectedCity(newCity)
        localStorage.setItem('selectedCity', JSON.stringify(newCity))
        setToast({ open: true, message: `Город определён: ${newCity.name}`, severity: 'success' })
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (error) {
      console.error('Error detecting city:', error)
      setToast({ open: true, message: 'Не удалось определить город', severity: 'error' })
    } finally {
      setIsDetecting(false)
      setCityModalOpen(false)
    }
  }

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity })
  }

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }))
  }

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleMouseEnter = (href: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setHoveredItem(href)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null)
    }, 150)
    setDropdownTimeout(timeout)
  }

  // Prevent hydration mismatch - render placeholder until mounted
  if (!mounted) {
    return (
      <header
        className={styles.header}
        suppressHydrationWarning
        style={{
          minHeight: 80,
          background: 'linear-gradient(180deg, #0a0f1c 0%, #111827 50%, #0f172a 100%)',
        }}
      />
    )
  }

  return (
    <>
      <header className={styles.header} suppressHydrationWarning>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>C</div>
            <span className={styles.logoText}>
              Cash<span>Peek</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <div 
                key={item.href}
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                >
                  {item.label}
                  {item.subitems && <KeyboardArrowDown sx={{ fontSize: 18, opacity: 0.6 }} />}
                </Link>
                
                {item.subitems && hoveredItem === item.href && (
                  <div 
                    className={styles.dropdown}
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.subitems.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={styles.dropdownItem}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Кнопка выбора города */}
            <button 
              className={styles.cityButton}
              onClick={() => setCityModalOpen(true)}
            >
              <LocationOn sx={{ fontSize: 18, color: '#10b981' }} />
              <span>{selectedCity ? selectedCity.name : 'Выбрать город'}</span>
            </button>
            <Link href="/mfo" className={styles.btnStart}>
              Сравнить займ
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu sx={{ fontSize: 24 }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <Link href="/" className={styles.mobileLogo} onClick={() => setMobileOpen(false)}>
              <div className={styles.logoIcon}>C</div>
              <span className={styles.logoText}>
                Cash<span>Peek</span>
              </span>
            </Link>
            <button 
              className={styles.hamburger}
              style={{ display: 'flex' }}
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <Close sx={{ fontSize: 24 }} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavItem}
                style={pathname === item.href ? { color: '#10b981', fontWeight: 600 } : {}}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.mobileActions}>
            <button 
              className={styles.mobileBtnLogin}
              onClick={() => { setCityModalOpen(true); setMobileOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <LocationOn sx={{ fontSize: 18 }} />
              {selectedCity ? selectedCity.name : 'Выбрать город'}
            </button>
            <Link href="/mfo" className={styles.mobileBtnStart} onClick={() => setMobileOpen(false)}>
              Сравнить займ
            </Link>
          </div>
        </div>
      )}

      {/* Модальное окно выбора города */}
      {cityModalOpen && (
        <div className={styles.cityModalOverlay} onClick={() => setCityModalOpen(false)}>
          <div className={styles.cityModal} onClick={e => e.stopPropagation()}>
            <div className={styles.cityModalHeader}>
              <h3>Выберите город</h3>
              <button className={styles.cityModalClose} onClick={() => setCityModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <button 
              className={styles.detectButton}
              onClick={detectCity}
              disabled={isDetecting}
            >
              <MyLocation sx={{ fontSize: 20, animation: isDetecting ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isDetecting ? 'Определяем...' : 'Определить автоматически'}</span>
            </button>

            <div className={styles.cityList}>
              <div className={styles.cityListTitle}>Популярные города</div>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.slug}
                  className={`${styles.cityItem} ${selectedCity?.slug === city.slug ? styles.cityItemActive : ''}`}
                  onClick={() => handleCitySelect(city)}
                >
                  <div className={styles.cityItemInfo}>
                    <span className={styles.cityItemName}>{city.name}</span>
                    <span className={styles.cityItemRegion}>{city.region}</span>
                  </div>
                  {selectedCity?.slug === city.slug && (
                    <Check sx={{ fontSize: 20, color: '#10b981' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast уведомления */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          sx={{ 
            bgcolor: toast.severity === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontWeight: 600,
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  )
}
