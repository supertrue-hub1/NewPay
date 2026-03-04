# Скрипт для настройки PostgreSQL на удаленном сервере

$server = "5.42.106.229"
$user = "root"
$password = "y,ryCBirzktZ-3"

# Команды для выполнения на сервере
$commands = @"
psql -U postgres <<'EOF'

-- Создание пользователя
DO
`$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'adminmfo') THEN
      CREATE USER adminmfo WITH PASSWORD '546815hH!';
   END IF;
END
`$do$;

-- Создание БД
CREATE DATABASE my_mfo;
ALTER DATABASE my_mfo OWNER TO adminmfo;

-- Подключение
\c my_mfo

-- Создание таблицы
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

-- Права
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO adminmfo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO adminmfo;

-- Данные
INSERT INTO mfo_companies (name, logo, rating, reviews, sum_min, sum_max, term_min, term_max, percent, first_free, instant, badge, site_url, address, phone, inn, ogrn, license) VALUES
('Екапуста', 'Е', 4.8, 45000, 1000, 30000, 5, 21, 0.8, true, true, 'Лучший выбор', 'https://ekapusta.com', 'г. Москва', '+7 495 1234567', '7714010336', '1127746672160', 'ЦБ РФ №2120177001838'),
('Займер', 'З', 4.7, 38000, 2000, 30000, 7, 30, 1, true, true, 'Без проверки', 'https://zaymer.ru', 'г. Москва', '+7 495 9876543', '7702829787', '1127746890521', 'ЦБ РФ №2110177000409'),
('MoneyMan', 'M', 4.6, 32000, 1500, 25000, 5, 30, 0.9, true, true, NULL, 'https://moneyman.ru', 'г. Санкт-Петербург', '+7 812 4567890', '7842431531', '1117847745361', 'ЦБ РФ №2110177000191'),
('Lime-zaim', 'L', 4.5, 28000, 2000, 20000, 10, 30, 1, false, true, 'С плохой КИ', 'https://lime-zaim.ru', 'г. Москва', '+7 495 1112233', '7703427466', '1187746887729', 'ЦБ РФ №1903550009325'),
('Webbankir', 'W', 4.4, 22000, 3000, 30000, 7, 30, 0.8, true, true, NULL, 'https://webbankir.com', 'г. Москва', '+7 495 2223344', '7702444160', '1167746311620', 'ЦБ РФ №2110177000187'),
('Joy.money', 'J', 4.3, 18000, 1000, 25000, 5, 30, 1, true, true, NULL, 'https://joy.money', 'г. Москва', '+7 495 3334455', '7703413904', '1157746088152', 'ЦБ РФ №2110177000783'),
('CreditPlus', 'C', 4.2, 15000, 2000, 20000, 5, 25, 0.9, true, true, NULL, 'https://creditplus.ru', 'г. Москва', '+7 495 4445566', '7704035363', '1157746758096', 'ЦБ РФ №2110177000864'),
('Pay P.S.', 'P', 4.1, 12000, 1000, 15000, 5, 20, 1, false, true, NULL, 'https://payps.ru', 'г. Москва', '+7 495 5556677', '7710942004', '1147746872394', 'ЦБ РФ №2110177000879');

SELECT * FROM mfo_companies;
\q
EOF
"@

# Выполняем команду через SSH
$cmd = "echo '$password' | ssh -o StrictHostKeyChecking=no $user@$server '$commands'"
Invoke-Expression $cmd
