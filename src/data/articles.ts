import { useState, useEffect, useCallback } from 'react'

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image?: string
  views: number
  // SEO поля
  seoTitle?: string
  seoDescription?: string
  seoOgImage?: string
  cover_image?: string
  status?: string
  reading_time?: number
  tags?: string[]
}

// Хук работает ТОЛЬКО с БД через API
export const useArticlesData = () => {
  const [articlesData, setArticlesData] = useState<Article[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных из API
  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/articles?page=1&limit=100')
      if (res.ok) {
        const data = await res.json()
        if (data.data) {
          const formattedData = data.data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            content: row.content || row.excerpt,
            cover_image: row.cover_image || row.coverImage,
            category: row.category,
            author: row.author || 'Редакция',
            date: row.published_at || row.created_at || new Date().toISOString(),
            views: row.views || 0,
            status: row.status,
            reading_time: row.reading_time || row.readingTime,
            tags: row.tags || [],
            seoTitle: row.seo_title || row.seoTitle,
            seoDescription: row.seo_description || row.seoDescription,
            seoOgImage: row.seo_og_image || row.seoOgImage,
          }))
          setArticlesData(formattedData)
        }
      }
    } catch (err) {
      console.error('Error loading articles:', err)
      setError('Ошибка при загрузке статей')
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const addArticle = async (article: Omit<Article, 'id'>) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          cover_image: article.cover_image || article.image,
          category: article.category,
          author: article.author,
          status: article.status || 'PUBLISHED',
          views: article.views || 0,
          reading_time: article.reading_time,
          tags: article.tags,
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        fetchArticles()
      }
    } catch (err) {
      console.error('Error adding article:', err)
      setError('Ошибка при добавлении статьи')
    }
  }

  const updateArticle = async (article: Article) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          cover_image: article.cover_image || article.image,
          category: article.category,
          author: article.author,
          status: article.status,
          views: article.views,
          reading_time: article.reading_time,
          tags: article.tags,
        }),
      })
      if (res.ok) {
        // Перезагружаем данные
        fetchArticles()
      }
    } catch (err) {
      console.error('Error updating article:', err)
      setError('Ошибка при обновлении статьи')
    }
  }

  const deleteArticle = async (id: number) => {
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Удаляем из локального состояния
        setArticlesData(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error('Error deleting article:', err)
      setError('Ошибка при удалении статьи')
    }
  }

  // Убрал resetArticles - данные берутся только из БД

  return { articlesData, addArticle, updateArticle, deleteArticle, isLoaded, error, refetch: fetchArticles }
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: 'Как выбрать лучший микрозайм',
    slug: 'kak-vybrat-luchshij-mikrozajm',
    excerpt: 'Полное руководство по выбору МФО: на что обратить внимание, какие подводные камни учитывать и как не переплатить.',
    content: `
## Как выбрать лучший микрозайм

При выборе микрозайма важно учитывать несколько ключевых факторов:

### 1. Процентная ставка
Обратите внимание на суточную ставку. В среднем она составляет 0.5-1.5% в день. Для новых клиентов многие МФО предлагают первый займ под 0%.

### 2. Сумма и срок
Оцените, какая сумма вам нужна и на какой срок. Чем меньше срок, тем меньше переплата.

### 3. Отзывы и рейтинг
Изучите отзывы о МФО на независимых платформах. Обратите внимание на рейтинг и количество отзывов.

### 4. Условия погашения
Узнайте, можно ли погасить займ досрочно без штрафов и комиссий.

### 5. Скорость выдачи
Для срочных ситуаций важна скорость рассмотрения заявки и перечисления денег.
    `,
    author: 'Финансовый эксперт',
    date: '2024-01-15',
    category: 'Советы',
    views: 1250,
  },
  {
    id: 2,
    title: 'Что такое грейс-период и как его использовать',
    slug: 'chto-takoe-grejs-period',
    excerpt: 'Разбираемся, как работает грейс-период на кредитной карте и можно ли использовать его для экономии на процентах.',
    content: `
## Что такое грейс-период

Грейс-период — это время, в течение которого банк не начисляет проценты на использованные средства.

### Как это работает

1. Вы тратите деньги с кредитной карты
2. До конца грейс-периода вы погашаете полную сумму задолженности
3. Проценты не начисляются

### Типичные значения грейс-периода

- **50-60 дней** — стандартный грейс-период
- **До 120 дней** — расширенный грейс-период (редкие предложения)

### Важные нюансы

- Грейс-период действует только при погашении полной суммы
- При просрочке проценты начисляются за весь период
    `,
    author: 'Банковский консультант',
    date: '2024-01-10',
    category: 'Образование',
    views: 890,
  },
  {
    id: 3,
    title: 'Как улучшить кредитную историю',
    slug: 'kak-uluchshit-kreditnuyu-istoriju',
    excerpt: 'Эффективные способы восстановления и улучшения кредитной истории: от своевременных платежей до рефинансирования.',
    content: `
## Как улучшить кредитную историю

Кредитная история — это ваш финансовый рейтинг. Вот проверенные способы его улучшения:

### 1. Своевременные платежи
Оплачивайте все кредиты и займы вовремя. Просрочки негативно сказываются на истории.

### 2. Не допускайте просрочек
Даже однодневная просрочка может испортить кредитную историю на несколько лет.

### 3. Берите небольшие займы
Начните с небольших сумм и успешно их погашайте. Это покажет банкам вашу платёжеспособность.

### 4. Не подавайте много заявок
Каждая заявка на кредит отображается в истории. Много отказов — плохой сигнал.

### 5. Закрывайте кредиты правильно
После погашения обязательно закройте счёт и получите справку об отсутствии задолженности.
    `,
    author: 'Кредитный брокер',
    date: '2024-01-05',
    category: 'Советы',
    views: 2100,
  },
  {
    id: 4,
    title: 'Кредитная карта или микрозайм: что выбрать',
    slug: 'kreditnaya-karta-ili-mikrozajm',
    excerpt: 'Сравниваем два популярных финансовых инструмента: когда выгоднее кредитка, а когда микрозайм.',
    content: `
## Кредитная карта или микрозайм

Выбор между кредитной картой и микрозаймом зависит от вашей ситуации.

### Когда выбрать микрозайм

- **Срочная потребность в деньгах** — займ выдаётся быстрее
- **Короткий срок** — до зарплаты
- **Плохая кредитная история** — МФО лояльнее к заёмщикам
- **Маленькая сумма** — до 30 000 рублей

### Когда выбрать кредитную карту

- **Долгосрочное использование** — грейс-период экономит проценты
- **Крупные покупки** — большой кредитный лимит
- **Регулярные траты** — кэшбэк и бонусы
- **Предсказуемые платежи** — фиксированный платёж

### Итоговое сравнение

| Параметр | Микрозайм | Кредитная карта |
|----------|-----------|-----------------|
| Скорость | 5-15 мин | 1-3 дня |
| Сумма | до 30 000 | до 500 000 |
| Срок | до 30 дней | до 3 лет |
| Ставка | 0.5-1.5%/день | 12-25%/год |
    `,
    author: 'Финансовый аналитик',
    date: '2024-01-01',
    category: 'Сравнение',
    views: 756,
  },
  {
    id: 5,
    title: 'Безопасность при онлайн-заявках на займ',
    slug: 'bezopasnost-pri-onlajn-zayavkah',
    excerpt: 'Как защитить свои данные и деньги при оформлении займа через интернет: основные правила и рекомендации.',
    content: `
## Безопасность при онлайн-заявках

Оформление займа онлайн удобно, но требует осторожности.

### Как проверить МФО

1. Проверьте наличие лицензии на сайте ЦБ РФ
2. Изучите отзывы на независимых ресурсах
3. Проверьте юридический адрес и реквизиты
4. Обратите внимание на официальный сайт (без ошибок в домене)

### Признаки мошенничества

- **Требуют предоплату** — честные МФО не берут плату за оформление
- **Обещают 100% одобрение** — так не бывает
- **Просят данные карты** — для перевода денег достаточно номера карты
- **Нет контактов** — только форма обратной связи

### Защита персональных данных

- Используйте официальные сайты МФО
- Не передавайте логины и пароли
- Не подтверждайте операции по SMS незнакомцам
- Регулярно проверяйте кредитную историю
    `,
    author: 'Специалист по безопасности',
    date: '2023-12-28',
    category: 'Безопасность',
    views: 543,
  },
]

export const useArticlesData = () => {
  const [articlesData, setArticlesData] = useState<Article[]>(initialArticles)

  useEffect(() => {
    const stored = localStorage.getItem('articles')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setArticlesData(parsed)
      } catch {
        // ignore parse error
      }
    }
  }, [])

  const saveArticles = (articles: Article[]) => {
    localStorage.setItem('articles', JSON.stringify(articles))
    setArticlesData(articles)
  }

  const addArticle = (article: Omit<Article, 'id'>) => {
    const newArticle = { ...article, id: Date.now() }
    saveArticles([...articlesData, newArticle])
  }

  const updateArticle = (article: Article) => {
    saveArticles(articlesData.map(a => a.id === article.id ? article : a))
  }

  const deleteArticle = (id: number) => {
    saveArticles(articlesData.filter(a => a.id !== id))
  }

  const resetArticles = () => {
    saveArticles(initialArticles)
  }

  return { articlesData, addArticle, updateArticle, deleteArticle, resetArticles }
}
