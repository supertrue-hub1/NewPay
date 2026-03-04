'use client'

import AllMfoContent from '@/app/allmfo/AllMfoContent'

interface LoansContentProps {
  title: string
}

export default function LoansContent({ title }: LoansContentProps) {
  return <AllMfoContent pageTitle={title} />
}
