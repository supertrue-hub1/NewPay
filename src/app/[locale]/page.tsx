import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import HomePageContent from './HomePageContent'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocalePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <HomePageContent locale={locale} />
    </NextIntlClientProvider>
  )
}
