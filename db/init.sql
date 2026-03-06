-- Создание базы данных my_mfo
-- Подключитесь к PostgreSQL как суперпользователь и выполните этот скрипт

-- Создание пользователя (если не существует)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'adminmfo') THEN
      CREATE USER adminmfo WITH PASSWORD '546815hH!';
   END IF;
END
$do$;

-- Создание базы данных
CREATE DATABASE my_mfo;

-- GRANT ALL PRIVILEGES ON DATABASE my_mfo TO adminmfo;
ALTER DATABASE my_mfo OWNER TO adminmfo;

-- Подключаемся к базе данных
\c my_mfo

-- Создание таблицы mfo_companies
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
    address TEXT,
    phone VARCHAR(50),
    inn VARCHAR(20),
    ogrn VARCHAR(20),
    license VARCHAR(255),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для статистики
CREATE TABLE IF NOT EXISTS mfo_stats (
    id SERIAL PRIMARY KEY,
    mfo_id INTEGER REFERENCES mfo_companies(id) ON DELETE CASCADE,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE
);

-- Создание индексов для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_mfo_name ON mfo_companies(name);
CREATE INDEX IF NOT EXISTS idx_mfo_rating ON mfo_companies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_mfo_stats_date ON mfo_stats(date);

-- Создание таблицы FAQ
CREATE TABLE IF NOT EXISTS faq (
    id SERIAL PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для FAQ
CREATE INDEX IF NOT EXISTS idx_faq_question ON faq(question);

-- Назначение прав пользователю
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO adminmfo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO adminmfo;

-- Вставка начальных данных FAQ
INSERT INTO faq (question, answer) VALUES
('Как взять займ?', 'Выберите сумму и срок на калькуляторе, заполните заявку и получите деньги на карту.'),
('Какие требования к заёмщику?', 'Возраст от 18 лет, паспорт РФ, постоянная регистрация.'),
('Как погасить займ?', 'Через личный кабинет МФО, банковским переводом или в терминале.'),
('Можно ли продлить займ?', 'Да, большинство МФО предоставляют услугу пролонгации.'),
('Как влияет кредитная история?', 'При плохой КИ шансы на одобрение ниже, но есть МФО с высоким процентом одобрения.'),
('Сколько времени занимает одобрение?', 'От 1 до 15 минут. Многие МФО одобряют заявки мгновенно.'),
('Какая максимальная сумма займа?', 'До 30 000 рублей для новых клиентов, постоянные клиенты могут получить до 100 000 рублей.');

-- Вставка начальных данных (примеры MFO)
INSERT INTO mfo_companies (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license) VALUES
('Екапуста', 'Е', 4.8, 45000, 1000, 30000, 5, 21, 0.8, true, true, 'Лучший выбор', 'https://ekapusta.com', 'г. Москва, ул. Ленина, 1', '+7 (495) 123-45-67', '7714010336', '1127746672160', 'ЦБ РФ № 2120177001838'),
('Займер', 'З', 4.7, 38000, 2000, 30000, 7, 30, 1, true, true, 'Без проверки', 'https://zaymer.ru', 'г. Москва, ул. Тверская, 10', '+7 (495) 987-65-43', '7702829787', '1127746890521', 'ЦБ РФ № 2110177000409'),
('MoneyMan', 'M', 4.6, 32000, 1500, 25000, 5, 30, 0.9, true, true, NULL, 'https://moneyman.ru', 'г. Санкт-Петербург, Невский пр., 50', '+7 (812) 456-78-90', '7842431531', '1117847745361', 'ЦБ РФ № 2110177000191'),
('Lime-zaim', 'L', 4.5, 28000, 2000, 20000, 10, 30, 1, false, true, 'С плохой КИ', 'https://lime-zaim.ru', 'г. Москва, ул. Пушкина, 25', '+7 (495) 111-22-33', '7703427466', '1187746887729', 'ЦБ РФ № 1903550009325'),
('Webbankir', 'W', 4.4, 22000, 3000, 30000, 7, 30, 0.8, true, true, NULL, 'https://webbankir.com', 'г. Москва, ул. Арбат, 15', '+7 (495) 222-33-44', '7702444160', '1167746311620', 'ЦБ РФ № 2110177000187'),
('Joy.money', 'J', 4.3, 18000, 1000, 25000, 5, 30, 1, true, true, NULL, 'https://joy.money', 'г. Москва, ул. Таганская, 20', '+7 (495) 333-44-55', '7703413904', '1157746088152', 'ЦБ РФ № 2110177000783'),
('CreditPlus', 'C', 4.2, 15000, 2000, 20000, 5, 25, 0.9, true, true, NULL, 'https://creditplus.ru', 'г. Москва, ул. Якиманка, 30', '+7 (495) 444-55-66', '7704035363', '1157746758096', 'ЦБ РФ № 2110177000864'),
('Pay P.S.', 'P', 4.1, 12000, 1000, 15000, 5, 20, 1, false, true, NULL, 'https://payps.ru', 'г. Москва, ул. Новый Арбат, 10', '+7 (495) 555-66-77', '7710942004', '1147746872394', 'ЦБ РФ № 2110177000879');
