import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

// ISR: статическая генерация с обновлением каждый час
export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    default: "NewPay.ru - Займы онлайн на карту за 5 минут",
    template: "%s | NewPay.ru"
  },
  description: "Сравните лучшие займы от МФО на NewPay.ru. Выберите оптимальные условия, оформите заявку и получите деньги на карту за 5 минут. Мгновенное одобрение!",
  keywords: "займы, онлайн займ, микрозайм, займ на карту, займ без отказа, займ с плохой КИ, МФО, кредит",
  authors: [{ name: "NewPay" }],
  creator: "NewPay",
  publisher: "NewPay",
  metadataBase: new URL("https://NewPay.ru"),
  alternates: {
    canonical: "https://NewPay.ru",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://NewPay.ru",
    siteName: "NewPay.ru",
    title: "NewPay.ru - Займы онлайн на карту за 5 минут",
    description: "Сравните лучшие займы от МФО. Выберите оптимальные условия, оформите заявку и получите деньги на карту за 5 минут.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NewPay.ru - Займы онлайн"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NewPay.ru - Займы онлайн на карту за 5 минут",
    description: "Сравните лучшие займы от МФО. Выберите оптимальные условия и получите деньги за 5 минут.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    yandex: "yandex-verification-code",
    google: "google-site-verification-code",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a237e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NewPay" />
        
        {/* Предзагрузка и DNS-prefetch для ускорения */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
