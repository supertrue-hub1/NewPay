import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Промокоды и скидки на займы МФО | Zaim-MFO',
  description: 'Актуальные промокоды и бонусы от микрофинансовых организаций. Получите скидку на первый займ или бесплатные деньги. Работающие промокоды 2024.',
}

export default function PromokodyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
