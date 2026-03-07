'use client'

import { ReactNode, useState } from 'react'
import { 
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, IconButton, Divider, useTheme,
  Avatar, Menu, MenuItem, Collapse, ListItemIcon as ListItemIconSub
} from '@mui/material'
import { 
  Dashboard, AccountBalance, CreditCard, Article, HelpOutline, 
  Analytics, Menu as MenuIcon, ChevronLeft,
  Settings, Logout, Person, Notifications, Info, ExpandLess, ExpandMore, Description, LocalOffer, Handshake
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

interface MenuItemType {
  label: string
  icon: ReactNode
  tabId: string
  subItems?: { label: string; tabId: string; icon: ReactNode }[]
}

const menuItems: MenuItemType[] = [
  { label: 'МФО', icon: <Dashboard />, tabId: 'mfo' },
  { label: 'Обзор МФО', icon: <Info />, tabId: 'mfoOverview' },
  { label: 'Кредитные карты', icon: <CreditCard />, tabId: 'cards' },
  { label: 'Блог', icon: <Article />, tabId: 'blog' },
  { label: 'FAQ', icon: <HelpOutline />, tabId: 'faq' },
  { label: 'Партнёры', icon: <Handshake />, tabId: 'partners' },
  { label: 'Футер', icon: <Settings />, tabId: 'footer' },
  { 
    label: 'Разное', 
    icon: <Info />, 
    tabId: 'misc',
    subItems: [
      { label: 'О нас', tabId: 'about', icon: <Description /> },
      { label: 'Пользовательское соглашение', tabId: 'terms', icon: <Description /> },
      { label: 'О займах', tabId: 'loansInfo', icon: <Info /> },
    ]
  },
  { label: 'Аналитика', icon: <Analytics />, tabId: 'analytics' },
]

export default function AdminLayout({ children, activeTab = 'mfo', onTabChange }: AdminLayoutProps) {
  const theme = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [openMisc, setOpenMisc] = useState(true)
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (tabId: string) => {
    // Для партнёров используем отдельную страницу
    if (tabId === 'partners') {
      router.push('/admin/partners')
      setMobileOpen(false)
      return
    }
    if (onTabChange) {
      onTabChange(tabId)
    }
    setMobileOpen(false)
  }

  const isSubItemActive = (subItems: { tabId: string }[]) => {
    return subItems.some(item => activeTab === item.tabId)
  }

  const drawerWidth = collapsed ? 72 : 260

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#1a1d2d',
      width: drawerWidth,
      transition: 'width 0.3s'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: 64
      }}>
        {!collapsed && (
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            NewPay
          </Typography>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white' }}>
          <ChevronLeft sx={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
        </IconButton>
      </Box>

      {/* Menu */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.tabId} disablePadding sx={{ px: 1 }}>
            {item.subItems ? (
              <>
                <ListItemButton
                  onClick={() => setOpenMisc(!openMisc)}
                  selected={isSubItemActive(item.subItems)}
                  sx={{
                    color: isSubItemActive(item.subItems) ? '#00b6ff' : 'rgba(255,255,255,0.7)',
                    bgcolor: isSubItemActive(item.subItems) ? 'rgba(0,182,255,0.1)' : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'inherit', 
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                      />
                      {openMisc ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItemButton>
                {!collapsed && (
                  <Collapse in={openMisc} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ ml: 1, mr: 1 }}>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.tabId}
                          onClick={() => handleMenuClick(subItem.tabId)}
                          selected={activeTab === subItem.tabId}
                          sx={{
                            pl: 4,
                            py: 1.5,
                            color: activeTab === subItem.tabId ? '#00b6ff' : 'rgba(255,255,255,0.6)',
                            bgcolor: activeTab === subItem.tabId ? 'rgba(0,182,255,0.15)' : 'transparent',
                            borderRadius: 1,
                            mb: 0.5,
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.05)',
                              color: 'white'
                            }
                          }}
                        >
                          <ListItemIconSub sx={{ 
                            color: 'inherit', 
                            minWidth: 32,
                            justifyContent: 'center'
                          }}>
                            {subItem.icon}
                          </ListItemIconSub>
                          <ListItemText 
                            primary={subItem.label} 
                            primaryTypographyProps={{ fontSize: 13 }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ) : (
              <ListItemButton
                onClick={() => handleMenuClick(item.tabId)}
                selected={activeTab === item.tabId}
                sx={{
                  color: activeTab === item.tabId ? '#00b6ff' : 'rgba(255,255,255,0.7)',
                  bgcolor: activeTab === item.tabId ? 'rgba(0,182,255,0.1)' : 'transparent',
                  borderRadius: 2,
                  mb: 0.5,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,182,255,0.1)',
                    color: '#00b6ff',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: collapsed ? 0 : 40,
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                )}
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {!collapsed && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', textAlign: 'center' }}>
            v1.0.0 • NewPay Admin
          </Typography>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f111a' }}>
      {/* Sidebar - Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 260,
              bgcolor: '#1a1d2d',
              borderRight: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#1a1d2d',
              borderRight: 'none',
              transition: 'width 0.3s'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: '#1a1d2d', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: (theme) => theme.zIndex.drawer - 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Notifications />
            </IconButton>

            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#00b6ff' }}>A</Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { mt: 1, bgcolor: '#1a1d2d', color: 'white' }
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon><Person sx={{ color: 'white' }} /></ListItemIcon>
                Профиль
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon><Settings sx={{ color: 'white' }} /></ListItemIcon>
                Настройки
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon><Logout sx={{ color: 'white' }} /></ListItemIcon>
                Выход
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#0f111a' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
