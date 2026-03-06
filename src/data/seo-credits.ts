// SEO-данные для генерации 1000 страниц займов

export interface SEOClientType {
  id: string
  name: string
  slug: string
  lsi: string[]
}

export interface SEOPurpose {
  id: string
  name: string
  slug: string
  lsi: string[]
}

export interface SEOFeature {
  id: string
  name: string
  slug: string
  lsi: string[]
}

export interface SEOAmount {
  id: string
  name: string
  slug: string
  min: number
  max: number
}

// Тип клиента
export const clientTypes: SEOClientType[] = [
  { id: 'pensioners', name: 'Пенсионеры', slug: 'dlya-pensionerov', lsi: ['пенсионерам', 'на пенсии', 'для пожилых'] },
  { id: 'students', name: 'Студенты', slug: 'dlya-studentov', lsi: ['студентам', 'учащимся', 'молодежи'] },
  { id: 'unemployed', name: 'Безработные', slug: 'dlya-bezrabotnyh', lsi: ['безработным', 'неработающим', 'без работы'] },
  { id: 'ip', name: 'ИП', slug: 'dlya-ip', lsi: ['индивидуальным предпринимателям', 'ИП', 'самозанятым'] },
  { id: 'families', name: 'Семьи с детьми', slug: 'dlya-semej-s-detmi', lsi: ['семьям', 'с детьми', 'многодетным'] },
  { id: 'housewives', name: 'Домохозяйки', slug: 'dlya-domohozyaek', lsi: ['домохозяйкам', 'на дому', 'безработным'] },
  { id: 'military', name: 'Военнослужащие', slug: 'dlya-voennosluzhashchih', lsi: ['военным', 'контрактникам', 'срочникам'] },
  { id: 'bad-ki', name: 'С плохой КИ', slug: 's-plohoj-ki', lsi: ['с плохой кредитной историей', 'просрочками', 'должникам'] },
]

// Цель займа
export const purposes: SEOPurpose[] = [
  { id: 'treatment', name: 'На лечение', slug: 'na-lechenie', lsi: ['на медицину', 'на операцию', 'на лекарства'] },
  { id: 'repair', name: 'На ремонт', slug: 'na-remont', lsi: ['ремонт квартиры', 'ремонт дома', 'на стройматериалы'] },
  { id: 'credit-refinance', name: 'На погашение кредитов', slug: 'na-pogashenie-kreditov', lsi: ['рефинансирование', 'погасить кредит', 'перекредитование'] },
  { id: 'wedding', name: 'На свадьбу', slug: 'na-svadbu', lsi: ['на свадебное торжество', 'на бракосочетание'] },
  { id: 'auto', name: 'На покупку авто', slug: 'na-pokupku-avto', lsi: ['на машину', 'на автомобиль', 'на авто'] },
  { id: 'education', name: 'На обучение', slug: 'na-obuchenie', lsi: ['на учебу', 'на образование', 'на курсы'] },
  { id: 'travel', name: 'На путешествие', slug: 'na-puteshestvie', lsi: ['на отпуск', 'на поездку', 'на туризм'] },
  { id: 'appliances', name: 'На технику', slug: 'na-tehniku', lsi: ['на бытовую технику', 'на электронику', 'на гаджеты'] },
  { id: 'business', name: 'На бизнес', slug: 'na-biznes', lsi: ['на предпринимательство', 'на дело', 'на стартап'] },
  { id: 'personal', name: 'На личные нужды', slug: 'na-lichnye-nuzhdy', lsi: ['на личные цели', 'потребительский', 'на свои нужды'] },
]

// Особенности
export const features: SEOFeature[] = [
  { id: 'no-refusal', name: 'Без отказа', slug: 'bez-otkaza', lsi: ['гарантированное одобрение', 'почти без отказа', 'высокая вероятность'] },
  { id: '24-7', name: 'Круглосуточно', slug: 'kruglosutochno', lsi: ['ночью', 'в любое время', '24/7'] },
  { id: 'to-card', name: 'На карту', slug: 'na-kartu', lsi: ['на банковскую карту', 'на Visa', 'на MasterCard'] },
  { id: 'online', name: 'Онлайн', slug: 'online', lsi: ['через интернет', 'дистанционно', 'не выходя из дома'] },
  { id: 'no-percent', name: 'Без процентов', slug: 'bez-procentov', lsi: ['бесплатно', '0%', 'первый займ бесплатно'] },
  { id: 'no-check', name: 'Без проверок', slug: 'bez-proverok', lsi: ['без проверки КИ', 'без сканов', 'по паспорту'] },
  { id: 'instant', name: 'Мгновенно', slug: 'mgnovenno', lsi: ['быстро', 'срочно', 'экспресс'] },
  { id: 'passport-only', name: 'По паспорту', slug: 'po-passportu', lsi: ['только по паспорту', 'без справок', 'по одному документу'] },
]

// Суммы
export const amounts: SEOAmount[] = [
  { id: 'small', name: 'До 10000', slug: 'do-10000', min: 1000, max: 10000 },
  { id: 'medium', name: 'До 30000', slug: 'do-30000', min: 1000, max: 30000 },
]
