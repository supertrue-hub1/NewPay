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

const Logo = () => (
  <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
    <img src="/header.svg" alt="NewPay" style={{ height: 100, marginLeft: 120 }} />
  </Link>
)

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
        style={{ minHeight: 80, background: '#fff', borderBottom: '1px solid #e5e7eb' }}
      />
    )
  }

  return (
    <>
      <header className={styles.header} suppressHydrationWarning>
        <div className={styles.container}>
          {/* Logo */}
          <div style={{ position: 'absolute', left: 24 }}>
            <Logo />
          </div>

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

          {/* Mobile Hamburger */}
          <button 
            className={styles.hamburger}
            style={{ position: 'absolute', right: 24 }}
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu sx={{ fontSize: 24, color: '#374151' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <Logo />
            <button 
              className={styles.hamburger}
              style={{ display: 'flex' }}
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <Close sx={{ fontSize: 24, color: '#374151' }} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavItem}
                style={pathname === item.href ? { color: '#4f46e5', fontWeight: 600 } : {}}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
