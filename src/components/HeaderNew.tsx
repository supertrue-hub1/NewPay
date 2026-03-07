'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Close, KeyboardArrowDown, Shield, Lock, Verified } from '@mui/icons-material'

interface NavItem {
  label: string
  href: string
  subitems?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Подобрать займ', href: '/allmfo' },
  { label: 'Как работает', href: '/about' },
  { label: 'Гарантии', href: '/faq' },
  { label: 'Отзывы', href: '/reviews' },
]

export default function HeaderNew() {
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

  if (!mounted) {
    return (
      <header
        style={{
          height: 85,
          background: '#2C3E50',
        }}
      />
    )
  }

  return (
    <>
      <header style={{
        background: '#2C3E50',
        position: 'relative',
        zIndex: 1000,
      }}>
        {/* Top bar with badges */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '8px 64px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 4,
            background: 'rgba(255, 140, 66, 0.15)',
          }}>
            <Lock sx={{ fontSize: 16, color: '#FF8C42' }} />
            <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>SSL</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 4,
            background: 'rgba(255, 140, 66, 0.15)',
          }}>
            <Verified sx={{ fontSize: 16, color: '#FF8C42' }} />
            <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>ЦБ РФ</span>
          </div>
        </div>

        {/* Main header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 64px',
          height: 72,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield sx={{ fontSize: 36, color: '#FF8C42' }} />
            <span style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Roboto, sans-serif',
            }}>
              CashPeek
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', gap: 32 }}>
            {navItems.map((item) => (
              <div
                key={item.href}
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  style={{
                    color: pathname === item.href ? '#FF8C42' : '#fff',
                    fontWeight: 500,
                    fontSize: 16,
                    fontFamily: 'Roboto, sans-serif',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 0',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                  {item.subitems && <KeyboardArrowDown sx={{ fontSize: 18, opacity: 0.6 }} />}
                </Link>

                {item.subitems && hoveredItem === item.href && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: '#fff',
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      minWidth: 200,
                      padding: '8px 0',
                      zIndex: 1001,
                    }}
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.subitems.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          color: '#2C3E50',
                          textDecoration: 'none',
                          fontSize: 14,
                          fontFamily: 'Roboto, sans-serif',
                          transition: 'background 0.2s',
                        }}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <button style={{
            background: '#FF8C42',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            Безопасный подбор
          </button>

          {/* Mobile Hamburger */}
          <button
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu sx={{ fontSize: 28, color: '#fff' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#2C3E50',
          zIndex: 1002,
          padding: 24,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield sx={{ fontSize: 32, color: '#FF8C42' }} />
              <span style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'Roboto, sans-serif',
              }}>
                CashPeek
              </span>
            </Link>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
              }}
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <Close sx={{ fontSize: 28, color: '#fff' }} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: pathname === item.href ? '#FF8C42' : '#fff',
                  fontWeight: 500,
                  fontSize: 18,
                  fontFamily: 'Roboto, sans-serif',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button style={{
            background: '#FF8C42',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '16px 24px',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            cursor: 'pointer',
            width: '100%',
            marginTop: 24,
          }}>
            Безопасный подбор
          </button>
        </div>
      )}
    </>
  )
}
