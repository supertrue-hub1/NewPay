import { notFound } from 'next/navigation'

// Этот компонент будет вызываться для 404 внутри локалей
export default function NotFoundLocale() {
  // Перенаправляем на глобальный not-found
  notFound()
}
