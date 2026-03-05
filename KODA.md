# KODA.md — Инструкция по проекту NewPay (SravniPay)

## Обзор проекта

**NewPay** (также известный как **SravniPay**) — это веб-приложение для сравнения микрофинансовых организаций (МФО) и займов в России. Сайт позволяет пользователям:

- Просматривать список МФО с рейтингами и отзывами
- Сравнивать условия займов (сумма, срок, процентная ставка)
- Оформлять заявки на займы онлайн
- Читать FAQ и статьи о финансах
- Пользоваться админ-панелью для управления контентом

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 16.1.6 | Фреймворк для React с серверным рендерингом |
| **React** | 19.2.3 | Библиотека для построения UI |
| **MUI (Material UI)** | 7.3.8 | Компоненты дизайна в Material Design стиле |
| **Tailwind CSS** | 4.2.1 | Утилитарный CSS-фреймворк |
| **TypeScript** | 5.9.3 | Типизация JavaScript |
| **PostgreSQL** | 14+ | База данных для хранения информации о МФО |
| **next-intl** | 4.8.3 | Интернационализация (i18n) |
| **Leaflet** | 1.9.4 | Интерактивные карты |
| **PM2** | — | Менеджер процессов для продакшена |

---

## Требования к окружению

- **Node.js**: версия >= 24.0.0
- **PostgreSQL**: версия 14+ (опционально, для динамических данных)
- **npm** для управления зависимостями

---

## Структура проекта

```
NewPay/
├── src/
│   ├── app/                    # Next.js App Router страницы
│   │   ├── admin/              # Админ-панель
│   │   ├── allmfo/             # Страница всех МФО с калькулятором
│   │   ├── articles/           # Статьи
│   │   ├── cards/              # Кредитные карты
│   │   ├── faq/                # FAQ страница
│   │   ├── loans/              # Категории займов (динамические)
│   │   │   └── [slug]/         # Динамические страницы займов
│   │   ├── mfo/                # Карточки отдельных МФО
│   │   │   └── [slug]/         # Динамические страницы МФО
│   │   ├── reviews/            # Отзывы
│   │   ├── sitemap/            # Карта сайта
│   │   ├── zaim/               # Главная страница займов
│   │   ├── zajmy-online/       # Займы онлайн по городам
│   │   ├── api/                # API роуты
│   │   ├── HomeContent.tsx     # Компонент главной страницы
│   │   └── layout.tsx          # Главный layout
│   ├── components/             # Переиспользуемые React-компоненты
│   ├── data/                   # Статические данные и хуки
│   ├── hooks/                  # Кастомные React-хуки
│   └── lib/                    # Утилиты и вспомогательные функции
├── public/                     # Статические файлы (изображения, иконки)
├── db/                         # SQL-скрипты для базы данных
│   ├── init.sql                # Начальная схема БД
│   └── init-complete.sql       # Полная схема БД
├── i18n/                       # Конфигурация интернационализации
│   ├── request.ts              # Обработка запросов i18n
│   └── routing.ts              # Маршрутизация i18n
├── messages/                   # Переводы
│   ├── ru.json                 # Русский язык
│   ├── ky.json                 # Кыргызский язык
│   ├── tg.json                 # Таджикский язык
│   └── uz.json                 # Узбекский язык
├── package.json                # Зависимости проекта
├── next.config.ts              # Конфигурация Next.js
├── tsconfig.json               # Конфигурация TypeScript
├── ecosystem.config.js         # Конфигурация PM2 для продакшена
├── next-sitemap.config.js      # Конфигурация sitemap
├── middleware.ts               # Next.js middleware
└── tailwind.config.ts          # Конфигурация Tailwind CSS
```

---

## Команды для запуска

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка проекта
npm run build

# Запуск продакшен-сервера
npm start

# Линтинг кода
npm run lint
```

### Запуск на сервере с PM2

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск с PM2
pm2 start ecosystem.config.js

# Перезапуск
pm2 restart all

# Логи
pm2 logs

# Список процессов
pm2 list
```

---

## Основные страницы сайта

| Маршрут | Описание |
|---------|----------|
| `/` | Главная страница |
| `/allmfo` | Все МФО с калькулятором займов |
| `/mfo/[slug]` | Карточка конкретного МФО |
| `/loans/[slug]` | Категории займов (zaim_na_kartu, zaim_online и др.) |
| `/cards` | Кредитные карты |
| `/articles` | Статьи о финансах |
| `/faq` | Часто задаваемые вопросы |
| `/reviews` | Отзывы о МФО |
| `/admin` | Админ-панель (требует пароль) |
| `/sitemap` | Карта сайта |
| `/zaim` | Главная страница займов |
| `/zajmy-online` | Займы онлайн по городам |

---

## Админ-панель

Доступ по адресу: `/admin`

**Пароль**: `546815hH`

Функции:
- Управление МФО (добавление, редактирование, удаление)
- Управление статьями
- Управление FAQ
- Управление кредитными картами
- Просмотр аналитики (клики, конверсии)
- Управление промокодами

---

## База данных

Проект использует PostgreSQL для хранения данных о МФО.

### Настройка БД

1. Создайте базу данных и пользователя (см. `DB_SETUP.md`)
2. Создайте файл `.env.local` в корне проекта:

```env
DB_USER=adminmfo
DB_PASSWORD=546815hH!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_mfo
```

### Запуск SQL-скрипта

```bash
psql -U postgres -f db/init.sql
```

### Структура таблицы mfo_companies

| Поле | Тип | Описание |
|------|-----|----------|
| id | SERIAL | ID записи |
| name | VARCHAR | Название МФО |
| logo | VARCHAR | Логотип |
| rating | DECIMAL | Рейтинг |
| reviews | INTEGER | Количество отзывов |
| sum_min | INTEGER | Минимальная сумма |
| sum_max | INTEGER | Максимальная сумма |
| term_min | INTEGER | Минимальный срок (дней) |
| term_max | INTEGER | Максимальный срок (дней) |
| percent | DECIMAL | Процентная ставка |
| first_free | BOOLEAN | Первый займ бесплатно |
| instant | BOOLEAN | Мгновенная выдача |
| badge | VARCHAR | Бейдж (метка) |
| site_url | VARCHAR | URL сайта МФО |
| address | TEXT | Адрес |
| phone | VARCHAR | Телефон |
| inn | VARCHAR | ИНН |
| ogrn | VARCHAR | ОГРН |
| license | VARCHAR | Лицензия |
| clicks | INTEGER | Количество кликов |
| conversions | INTEGER | Количество конверсий |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

---

## Развёртывание на Timeweb

### Вариант 1: Через GitHub (рекомендуется)

1. Код уже на GitHub: https://github.com/supertrue-hub1/NewPay
2. В панели Timeweb: **Git** → **Добавить проект**
3. Выберите GitHub → авторизуйтесь
4. Выберите репозиторий **NewPay**
5. Настройки:
   - Команда сборки: `npm install && npm run build`
   - Команда запуска: `npm run start`
   - Директория: `.` или `public_html`
   - Node.js: **20** или выше

### Вариант 2: Через архив

1. Создайте архив: `Compress-Archive -Path * -DestinationPath NewPay.zip`
2. Загрузите на Timeweb через Файловый менеджер
3. Распакуйте и настройте как выше

### Вариант 3: Через SSH

```bash
# Подключение к серверу
ssh username@your-server-ip

# Клонирование репозитория
git clone https://github.com/supertrue-hub1/NewPay.git
cd NewPay

# Установка зависимостей и сборка
npm install
npm run build

# Запуск с PM2
pm2 start ecosystem.config.js

# Проверка статуса
pm2 list
pm2 logs
```

---

## Развёртывание на Vercel (альтернатива)

1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. **Add New** → **Project**
4. Выберите репозиторий **NewPay**
5. Настройки:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.`
6. Нажмите **Deploy**

---

## GitHub синхронизация

### Пуш изменений на GitHub

```bash
git add .
git commit -m "Description of changes"
git push
```

### Обновление на сервере

```bash
git pull
npm run build
pm2 restart all
```

---

## Важные примечания

### Требования Node.js

Проект требует **Node.js версии >= 24.0.0**. На Timeweb может потребоваться настройка версии.

### Конфигурация PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'next-mfo',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### JSON-LD Schema

На страницах МФО внедрена разметка:
- **LoanOrCredit** — для финансовых продуктов
- **AggregateRating** — для отображения звёздочек в поиске
- **FAQPage** — для расширенных сниппетов в Google/Яндекс

### Интернационализация

Проект поддерживает несколько языков:
- Русский (ru)
- Кыргызский (ky)
- Таджикский (tg)
- Узбекский (uz)

Переключение языков реализовано через `next-intl`.

---

## Устранение неполадок

### Ошибка "Permission denied" при запуске

```bash
chmod -R 755 node_modules/.bin
npm run start
```

или

```bash
npx next start
```

### Порт занят (EADDRINUSE)

```bash
fuser -k 3000/tcp
npm run start
```

### Неверная версия Node.js

Убедитесь, что используется Node.js >= 24.0.0:

```bash
node -v
```

### Карточки займов не обновляются на хостинге

После любых изменений кода обязательно нужно делать:

```bash
# На хостинге
git pull
npm install
npm run build
pm2 restart all
```

Просто `git pull` недостаточно — нужен новый билд.

---

## Контакты и поддержка

Проект разработан для сравнения МФО России. При возникновении вопросов обращайтесь к документации или к команде разработки.

Репозиторий GitHub: https://github.com/supertrue-hub1/NewPay

---

## TODO (текущие задачи)

### Phase 1: Configuration Changes

- [ ] 1. Update next.config.ts for static export (output: 'export')
- [ ] 2. Configure next-intl for static export
- [ ] 3. Update/fix middleware for static hosting
- [ ] 4. Update routing for static export

### Phase 2: Build & Test

- [ ] 5. Test build locally with `npm run build`
- [ ] 6. Verify static output in `out/` directory

### Phase 3: Deployment to Timeweb

- [ ] 7. Upload files to Timeweb via FTP/SSH
- [ ] 8. Configure .htaccess for proper routing
- [ ] 9. Test the deployed site

---

*Обновлено: март 2025*
