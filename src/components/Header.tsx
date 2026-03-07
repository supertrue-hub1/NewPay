'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Close, KeyboardArrowDown } from '@mui/icons-material'
import styles from './Header.module.css'

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

  useEffect(() => {
    setMounted(true)
  }, [])

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
            <Link href="/admin" className={styles.btnLogin}>
              Войти
            </Link>
            <Link href="/allmfo" className={styles.btnStart}>
              Начать
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
            <Link href="/admin" className={styles.mobileBtnLogin} onClick={() => setMobileOpen(false)}>
              Войти
            </Link>
            <Link href="/allmfo" className={styles.mobileBtnStart} onClick={() => setMobileOpen(false)}>
              Начать
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
