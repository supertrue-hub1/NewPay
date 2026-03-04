import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Нелегальные кредиторы и мошенники | Zaim-MFO',
  description: 'Узнайте, как распознать нелегальных кредиторов и мошенников. Проверьте компанию перед займом. Список признаков мошенничества.',
}

export default function IllegalLendersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
