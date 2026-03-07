import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // i18n configuration for static export
  
  // Отключить автоматический preload для устранения предупреждений
  produceBrowserAssets: false,
  
  // Rewrites для раздачи загруженных изображений через /api/images/*
  async rewrites() {
    return [
      {
        source: '/api/images/:filename',
        destination: '/images/articles/:filename',
      },
    ]
  },
  
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    unoptimized: true, // Required for static export
  },
  
  // Оптимизация компиляции
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Оптимизация экспертов
  experimental: {
    optimizePackageImports: [
      '@mui/material', 
      '@mui/icons-material', 
      '@mui/x-charts',
    ],
  },
  
  // Включить сжатие
  compress: true,
  
  // Оптимизация производственной сборки
  productionBrowserSourceMaps: false,
  
  // Повторное использование инстансов
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // Trailing slash for static hosting
  trailingSlash: true,
  
};

export default withNextIntl(nextConfig);
