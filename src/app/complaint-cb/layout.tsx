import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Жалоба в ЦБ РФ | Zaim-MFO',
  description: 'Как правильно подать жалобу в Центральный банк Российской Федерации на нарушения со стороны микрофинансовых организаций',
}

export default function ComplaintCBLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
