'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react'

// Предвычисленные значения (зафиксированы при компиляции)
const SPHERES = [
  { x: 10, y: 20, size: 300, duration: 20 },
  { x: 80, y: 10, size: 200, duration: 25 },
  { x: 30, y: 60, size: 150, duration: 18 },
  { x: 70, y: 70, size: 250, duration: 22 },
  { x: 50, y: 30, size: 180, duration: 28 },
  { x: 20, y: 80, size: 120, duration: 16 },
  { x: 90, y: 40, size: 100, duration: 24 },
  { x: 60, y: 90, size: 220, duration: 19 },
] as const

const PARTICLES = [
  { id: 0, x: 5, delay: 0.2, duration: 10, size: 3 },
  { id: 1, x: 15, delay: 1.5, duration: 12, size: 2 },
  { id: 2, x: 25, delay: 0.8, duration: 9, size: 4 },
  { id: 3, x: 35, delay: 2.1, duration: 11, size: 2 },
  { id: 4, x: 45, delay: 0.5, duration: 8, size: 3 },
  { id: 5, x: 55, delay: 1.8, duration: 13, size: 2 },
  { id: 6, x: 65, delay: 3.2, duration: 10, size: 4 },
  { id: 7, x: 75, delay: 0.9, duration: 9, size: 3 },
  { id: 8, x: 85, delay: 2.5, duration: 12, size: 2 },
  { id: 9, x: 95, delay: 1.2, duration: 11, size: 3 },
  { id: 10, x: 10, delay: 4.0, duration: 8, size: 2 },
  { id: 11, x: 30, delay: 2.8, duration: 10, size: 3 },
  { id: 12, x: 60, delay: 1.0, duration: 9, size: 2 },
  { id: 13, x: 80, delay: 3.5, duration: 12, size: 4 },
  { id: 14, x: 50, delay: 0.3, duration: 11, size: 2 },
] as const

// Анимированные сферы на фоне
function AnimatedSpheres() {
  return (
    <>
      {SPHERES.map((sphere, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5 blur-3xl"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            width: sphere.size,
            height: sphere.size,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
          }}
          transition={{
            duration: sphere.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}

// Поднимающиеся частицы
function RisingParticles() {
  return (
    <>
      {PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: '-20px',
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -600],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

// Glitch эффект для текста 404
function GlitchText() {
  return (
    <div className="relative inline-block">
      {/* Red layer - left offset */}
      <motion.span
        className="absolute top-0 left-[-4px] text-red-500/30 text-[8rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter"
        animate={{
          x: [-4, 4, -4, 2, -2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        404
      </motion.span>
      
      {/* Cyan layer - right offset */}
      <motion.span
        className="absolute top-0 left-[4px] text-cyan-500/30 text-[8rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter"
        animate={{
          x: [4, -4, 4, -2, 2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        404
      </motion.span>
      
      {/* Main gradient text */}
      <span className="relative text-[8rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter bg-gradient-to-b from-primary/80 via-primary to-primary/80 bg-clip-text text-transparent">
        404
      </span>
    </div>
  )
}

// Вращающиеся Sparkles вокруг заголовка
function RotatingSparkles() {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles className="w-6 h-6 text-primary" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles className="w-8 h-8 text-primary/70" />
      </motion.div>
    </div>
  )
}

// Астронавт с анимацией
function FloatingAstronaut() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="text-6xl md:text-7xl lg:text-8xl"
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        👨‍🚀
      </motion.div>
    </motion.div>
  )
}

// Кнопка с shimmer эффектом
function ShimmerButton({ children, onClick, icon: Icon }: { 
  children: React.ReactNode
  onClick?: () => void
  icon: React.ElementType
}) {
  return (
    <motion.button
      className="relative group bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <span className="relative flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {children}
      </span>
    </motion.button>
  )
}

// Декоративные элементы
function DecorativeElements() {
  return (
    <>
      {/* 🌟 bottom left - rotating clockwise */}
      <motion.div
        className="absolute bottom-8 left-8 text-2xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      >
        🌟
      </motion.div>

      {/* 🚀 top right - rotating counter-clockwise */}
      <motion.div
        className="absolute top-8 right-8 text-2xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      >
        🚀
      </motion.div>

      {/* 🌙 left - floating up down */}
      <motion.div
        className="absolute left-4 top-1/2 text-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        🌙
      </motion.div>

      {/* ✨ right bottom - pulsing */}
      <motion.div
        className="absolute bottom-16 right-4 text-xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform,opacity' }}
      >
        ✨
      </motion.div>

      {/* 💫 additional star */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-lg opacity-60"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform,opacity' }}
      >
        💫
      </motion.div>

      {/* ⭐ another star */}
      <motion.div
        className="absolute top-1/3 right-1/3 text-lg opacity-50"
        animate={{ 
          y: [0, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ willChange: 'transform' }}
      >
        ⭐
      </motion.div>
    </>
  )
}

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Could implement search redirect here
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated background elements */}
      <AnimatedSpheres />
      <RisingParticles />
      
      {/* Decorative elements */}
      <DecorativeElements />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* 404 Glitch Text */}
        <div className="mb-8">
          <GlitchText />
        </div>

        {/* Message with rotating sparkles */}
        <div className="flex items-center gap-4 mb-4">
          <RotatingSparkles />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center">
            Страница не найдена
          </h1>
          <RotatingSparkles />
        </div>

        <p className="text-lg md:text-xl text-muted-foreground text-center mb-8 max-w-md">
          Вы попали в неизведанную территорию космоса. Эта страница потерялась где-то между звёзд.
        </p>

        {/* Astronaut */}
        <div className="mb-10">
          <FloatingAstronaut />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/">
            <ShimmerButton icon={Home}>
              На главную
            </ShimmerButton>
          </Link>
          
          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-muted/50 border border-border backdrop-blur-sm"
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </motion.button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по сайту..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
