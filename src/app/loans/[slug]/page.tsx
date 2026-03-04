import { Metadata } from 'next'
import LoansContent from './LoansContent'

// Метаданные для каждой категории
const categoryMetadata: Record<string, { title: string; description: string }> = {
  'zaim_online': {
    title: 'Займ онлайн на карту за 5 минут — срочный займ онлайн | NewPay',
    description: 'Оформите займ онлайн мгновенно. Первый займ под 0%, перевод на любую карту за 5 минут. Лучшие МФО России.',
  },
  'zaim_na_kartu': {
    title: 'Займ на карту — мгновенно и без отказа | NewPay',
    description: 'Получите займ на карту за 5 минут. Без проверки кредитной истории, с моментальным одобрением.',
  },
  'zaim_bez_otkaza': {
    title: 'Займ без отказа — гарантированное одобрение | NewPay',
    description: 'Займ без отказа 99%! Без проверки кредитной истории, с плохой КИ. Мгновенное одобрение.',
  },
  'zaim_po_pasportu': {
    title: 'Займ по паспорту онлайн — только паспорт | NewPay',
    description: 'Оформите займ только по паспорту. Без справок и поручителей. Мгновенное решение за 5 минут.',
  },
  'zaim_bez_procentov': {
    title: 'Займ без процентов — первый займ 0% | NewPay',
    description: 'Первый займ под 0%! Бесплатно получите до 30000 рублей. Акции и бонусы для новых клиентов.',
  },
  'zaim_s_prosrochkam': {
    title: 'Займ с просрочками — получите деньги даже с долгами | NewPay',
    description: 'Займ с просрочками и плохой кредитной историей. Поможем получить деньги несмотря на долги.',
  },
  'zaim_do_zarplaty': {
    title: 'Займ до зарплаты — деньги до зарплаты | NewPay',
    description: 'Срочный займ до зарплаты. Небольшие суммы на короткий срок. Оплата при получении зарплаты.',
  },
  'zaim_dlya_studentov': {
    title: 'Займ для студентов — деньги на учёбу | NewPay',
    description: 'Студенческий займ без справок о доходах. Оформите онлайн, получите на карту мгновенно.',
  },
}

// Генерация статических параметров
export async function generateStaticParams() {
  return Object.keys(categoryMetadata).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const meta = categoryMetadata[slug] || {
    title: 'Займы онлайн — все предложения МФО | NewPay',
    description: 'Лучшие займы онлайн от проверенных МФО России. Сравните ставки и выберите выгодное предложение.',
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: `https://NewPay.ru/loans/${slug}`,
      siteName: 'NewPay',
    },
  }
}

export default async function LoansPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Получаем заголовок категории из slug
  const categoryTitles: Record<string, string> = {
    'zaim_online': 'Займ онлайн',
    'zaim_na_kartu': 'Займ на карту',
    'zaim_bez_otkaza': 'Займ без отказа',
    'zaim_po_pasportu': 'Займ по паспорту',
    'zaim_bez_procentov': 'Займ без процентов',
    'zaim_s_prosrochkam': 'Займ с просрочками',
    'zaim_do_zarplaty': 'Займ до зарплаты',
    'zaim_dlya_studentov': 'Займ для студентов',
  }

  const title = categoryTitles[slug] || 'Все займы'

  return <LoansContent title={title} />
}
