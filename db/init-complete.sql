-- Скрипт инициализации базы данных NewPay
-- Выполните этот скрипт в PostgreSQL для настройки БД

-- =============================================
-- СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ И БАЗЫ ДАННЫХ
-- =============================================

-- Создание пользователя (выполните от имени postgres)
-- CREATE USER adminmfo WITH PASSWORD '546815hH!';
-- CREATE DATABASE my_mfo OWNER adminmfo;
-- GRANT ALL PRIVILEGES ON DATABASE my_mfo TO adminmfo;

-- Подключение к базе
-- \c my_mfo

-- =============================================
-- ТАБЛИЦЫ
-- =============================================

-- Таблица МФО
CREATE TABLE IF NOT EXISTS mfo_companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    sum_min INTEGER DEFAULT 0,
    sum_max INTEGER DEFAULT 0,
    term_min INTEGER DEFAULT 0,
    term_max INTEGER DEFAULT 0,
    percent DECIMAL(5,2) DEFAULT 0,
    first_free BOOLEAN DEFAULT false,
    instant BOOLEAN DEFAULT false,
    badge VARCHAR(255),
    site_url VARCHAR(500),
    info_modal TEXT,
    address VARCHAR(500),
    phone VARCHAR(50),
    inn VARCHAR(20),
    ogrn VARCHAR(20),
    license VARCHAR(100),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статей
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_id INTEGER,
    status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    views INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Таблица FAQ
CREATE TABLE IF NOT EXISTS faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица кредитных карт
CREATE TABLE IF NOT EXISTS credit_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    image VARCHAR(500),
    annual_fee INTEGER DEFAULT 0,
    cashback VARCHAR(100),
    grace_period INTEGER DEFAULT 0,
    interest_rate DECIMAL(5,2) DEFAULT 0,
    limit_min INTEGER DEFAULT 0,
    limit_max INTEGER DEFAULT 0,
    requirements TEXT,
    benefits TEXT[],
    site_url VARCHAR(500),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий займов
CREATE TABLE IF NOT EXISTS loan_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    order_num INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица промокодов
CREATE TABLE IF NOT EXISTS promokods (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount VARCHAR(100),
    mfo_id INTEGER REFERENCES mfo_companies(id),
    valid_until DATE,
    is_active BOOLEAN DEFAULT true,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица аналитики
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    mfo_id INTEGER REFERENCES mfo_companies(id),
    event_type VARCHAR(50) NOT NULL,
    ip_hash VARCHAR(100),
    user_agent TEXT,
    referrer VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ИНДЕКСЫ
-- =============================================

CREATE INDEX IF NOT EXISTS idx_mfo_rating ON mfo_companies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_mfo_clicks ON mfo_companies(clicks DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_mfo ON analytics(mfo_id, event_type);

-- =============================================
-- ДАННЫЕ МФО
-- =============================================

INSERT INTO mfo_companies (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, clicks, conversions) VALUES
('Екапуста', 'Е', 4.8, 45000, 1000, 30000, 5, 21, 0.8, true, true, 'Лучший выбор', 'https://ekapusta.com', 12500, 3200),
('Займер', 'З', 4.7, 38000, 2000, 30000, 7, 30, 1, true, true, 'Без проверки', 'https://zaymer.ru', 9800, 2500),
('MoneyMan', 'M', 4.6, 32000, 1500, 25000, 5, 30, 0.9, true, true, NULL, 'https://moneyman.ru', 8500, 2100),
('Lime-zaim', 'L', 4.5, 28000, 2000, 20000, 10, 30, 1, false, true, 'С плохой КИ', 'https://lime-zaim.ru', 7200, 1800),
('Webbankir', 'W', 4.4, 22000, 3000, 30000, 7, 30, 0.8, true, true, NULL, 'https://webbankir.com', 6100, 1500),
('Joy.money', 'J', 4.3, 18000, 1000, 25000, 5, 30, 1, true, true, NULL, 'https://joy.money', 5400, 1300),
('CreditPlus', 'C', 4.2, 15000, 2000, 20000, 5, 25, 0.9, true, true, NULL, 'https://creditplus.ru', 4800, 1100),
('Pay P.S.', 'P', 4.1, 12000, 1000, 15000, 5, 20, 1, false, true, NULL, 'https://payps.ru', 4100, 950),
('Быстроденьги', 'Б', 4.0, 9500, 1000, 30000, 7, 30, 0.9, true, true, NULL, 'https://bistrodengi.ru', 3500, 800),
('Турбозайм', 'Т', 3.9, 7500, 3000, 20000, 7, 14, 1, true, true, NULL, 'https://turbozaym.ru', 2900, 650);

-- =============================================
-- ДАННЫЕ СТАТЕЙ
-- =============================================

INSERT INTO articles (slug, title, excerpt, content, category, author, status, views, reading_time, tags, published_at) VALUES
('kak-vybrat-luchshij-mikrozajm', 'Как выбрать лучший микрозайм', 
'Полное руководство по выбору МФО: на что обратить внимание, какие подводные камни учитывать и как не переплатить.',
'## Как выбрать лучший микрозайм

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
Для срочных ситуаций важна скорость рассмотрения заявки и перечисления денег.',
'Советы', 'Финансовый эксперт', 'PUBLISHED', 1250, 5, ARRAY['микрозаймы', 'выбор МФО', 'финансы'], CURRENT_TIMESTAMP),

('chto-takoe-grejs-period', 'Что такое грейс-период и как его использовать',
'Разбираемся, как работает грейс-период на кредитной карте и можно ли использовать его для экономии на процентах.',
'## Что такое грейс-период

Грейс-период — это время, в течение которого банк не начисляет проценты на использованные средства.

### Как это работает

1. Вы тратите деньги с кредитной карты
2. До конца грейс-периода вы погашаете полную сумму задолженности
3. Проценты не начисляются

### Типичные значения грейс-периода

- **50-60 дней** — стандартный грейс-период
- **До 120 дней** — расширенный грейс-период',
'Образование', 'Банковский консультант', 'PUBLISHED', 890, 4, ARRAY['грейс-период', 'кредитная карта', 'банки'], CURRENT_TIMESTAMP),

('kak-uluchshit-kreditnuyu-istoriju', 'Как улучшить кредитную историю',
'Эффективные способы восстановления и улучшения кредитной истории: от своевременных платежей до рефинансирования.',
'## Как улучшить кредитную историю

Кредитная история — это ваш финансовый рейтинг. Вот проверенные способы его улучшения:

### 1. Своевременные платежи
Оплачивайте все кредиты и займы вовремя. Просрочки негативно сказываются на истории.

### 2. Не допускайте просрочек
Даже однодневная просрочка может испортить кредитную историю на несколько лет.

### 3. Берите небольшие займы
Начните с небольших сумм и успешно их погашайте.',
'Советы', 'Кредитный брокер', 'PUBLISHED', 2100, 6, ARRAY['кредитная история', 'кредитный рейтинг', 'советы'], CURRENT_TIMESTAMP),

('kreditnaya-karta-ili-mikrozajm', 'Кредитная карта или микрозайм: что выбрать',
'Сравниваем два популярных финансовых инструмента: когда выгоднее кредитка, а когда микрозайм.',
'## Кредитная карта или микрозайм

Выбор между кредитной картой и микрозаймом зависит от вашей ситуации.

### Когда выбрать микрозайм

- **Срочная потребность в деньгах** — займ выдаётся быстрее
- **Короткий срок** — до зарплаты
- **Плохая кредитная история** — МФО лояльнее к заёмщикам

### Когда выбрать кредитную карту

- **Долгосрочное использование** — грейс-период экономит проценты
- **Крупные покупки** — большой кредитный лимит',
'Сравнение', 'Финансовый аналитик', 'PUBLISHED', 756, 5, ARRAY['кредитная карта', 'микрозайм', 'сравнение'], CURRENT_TIMESTAMP),

('bezopasnost-pri-onlajn-zayavkah', 'Безопасность при онлайн-заявках на займ',
'Как защитить свои данные и деньги при оформлении займа через интернет: основные правила и рекомендации.',
'## Безопасность при онлайн-заявках

Оформление займа онлайн удобно, но требует осторожности.

### Как проверить МФО

1. Проверьте наличие лицензии на сайте ЦБ РФ
2. Изучите отзывы на независимых ресурсах
3. Проверьте юридический адрес и реквизиты

### Признаки мошенничества

- **Требуют предоплату** — честные МФО не берут плату за оформление
- **Обещают 100% одобрение** — так не бывает',
'Безопасность', 'Специалист по безопасности', 'PUBLISHED', 543, 4, ARRAY['безопасность', 'мошенничество', 'онлайн-заявки'], CURRENT_TIMESTAMP);

-- =============================================
-- ДАННЫЕ FAQ
-- =============================================

INSERT INTO faq (question, answer, category, order_num) VALUES
('Что такое микрозайм?', 'Микрозайм — это небольшой кредит на короткий срок (обычно до 30 дней), который выдаётся микрофинансовыми организациями (МФО). Сумма займа обычно составляет от 1 000 до 30 000 рублей.', 'Общие вопросы', 1),
('Какие документы нужны для получения займа?', 'Для оформления микрозайма обычно нужен только паспорт РФ. Некоторые МФО могут запросить дополнительные документы: СНИЛС, ИНН или водительское удостоверение.', 'Оформление', 2),
('Как быстро дадут деньги?', 'Большинство МФО рассматривают заявку за 5-15 минут. Деньги переводятся на карту мгновенно после одобрения.', 'Оформление', 3),
('Можно ли получить займ с плохой кредитной историей?', 'Да, многие МФО выдают займы людям с плохой кредитной историей или просрочками. Однако условия могут быть менее выгодными.', 'Кредитная история', 4),
('Как погасить займ досрочно?', 'Вы можете погасить займ досрочно в любой момент. При этом проценты начисляются только за фактический срок использования денег.', 'Погашение', 5),
('Что будет, если не вернуть займ в срок?', 'При просрочке начисляются штрафные проценты. Также информация о просрочке передаётся в бюро кредитных историй, что негативно скажется на вашей кредитной истории.', 'Погашение', 6);

-- =============================================
-- КАТЕГОРИИ ЗАЙМОВ
-- =============================================

INSERT INTO loan_categories (slug, name, description, icon, order_num) VALUES
('zaim_na_kartu', 'Займ на карту', 'Быстрые займы с переводом на банковскую карту', 'credit_card', 1),
('zaim_online', 'Онлайн займ', 'Оформите займ не выходя из дома', 'computer', 2),
('zaim_bez_otkaza', 'Займ без отказа', 'Высокий шанс одобрения даже с плохой КИ', 'verified', 3),
('zaim_s_plokhoj_ki', 'С плохой КИ', 'Займы для людей с негативной кредитной историей', 'history', 4),
('pervyj_zajm_besplatno', 'Первый займ бесплатно', 'Новым клиентам — займ под 0%', 'star', 5),
('zaim_srochno', 'Срочный займ', 'Деньги за 5 минут', 'bolt', 6),
('zaim_bez_procentov', 'Без процентов', 'Займы под 0% годовых', 'percent', 7),
('zaim_na_kivi', 'На QIWI кошелёк', 'Перевод на электронный кошелёк QIWI', 'wallet', 8);

-- =============================================
-- ПРИМЕРЫ КРЕДИТНЫХ КАРТ
-- =============================================

INSERT INTO credit_cards (name, logo, annual_fee, cashback, grace_period, interest_rate, limit_min, limit_max, site_url, clicks) VALUES
('Tinkoff Platinum', 'T', 0, '1-30%', 55, 12.9, 30000, 300000, 'https://tinkoff.ru/cards/credit-cards/platinum/', 4500),
('Alfa-Bank Travel', 'A', 9900, '2-10%', 60, 11.99, 50000, 500000, 'https://alfabank.ru/make-card/travel/', 3800),
('Raiffeisen Travel', 'R', 8900, '1.5-5%', 55, 14.9, 50000, 400000, 'https://raiffeisen.ru/retail/creditcards/travel/', 2900),
('Уралсиб Кэшбэк', 'У', 1200, '3-10%', 50, 13.0, 30000, 300000, 'https://uralsib.ru/cards/credit/cashback/', 2100);

-- =============================================
-- ПРИМЕРЫ ПРОМОКОДОВ
-- =============================================

INSERT INTO promokods (code, description, discount, mfo_id, valid_until, is_active) VALUES
('WELCOME500', 'Промокод на 500 рублей для новых клиентов', '500 руб.', 1, '2026-12-31', true),
('SPEED1000', 'Скидка 1000 рублей на первый займ', '1000 руб.', 2, '2026-06-30', true),
('FIRST0', 'Первый займ под 0%', '0%', 3, '2026-12-31', true);

-- =============================================
-- КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ
-- =============================================

-- Создать расширение для массивов
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Выдать права на таблицы
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO adminmfo;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO adminmfo;

-- Просмотр данных
-- SELECT * FROM mfo_companies ORDER BY rating DESC;
-- SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY views DESC;
-- SELECT * FROM faq ORDER BY order_num;
