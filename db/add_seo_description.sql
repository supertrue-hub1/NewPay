-- Добавление колонки seo_description в таблицу mfo_companies
ALTER TABLE mfo_companies ADD COLUMN IF NOT EXISTS seo_description VARCHAR(500);

-- Обновление существующих записей с примерами SEO-подписей
UPDATE mfo_companies SET seo_description = 'Первый займ 0% • Одобрение за 2 минуты' WHERE name = 'Екапуста';
UPDATE mfo_companies SET seo_description = 'Автоматическое одобрение • Круглосуточно' WHERE name = 'Займер';
UPDATE mfo_companies SET seo_description = 'Первый займ бесплатно • Без скрытых комиссий' WHERE name = 'MoneyMan';
UPDATE mfo_companies SET seo_description = 'Даже с просрочками • Мгновенная выдача' WHERE name = 'Lime-zaim';
UPDATE mfo_companies SET seo_description = 'Ставка от 0,8% • Деньги за 5 минут' WHERE name = 'Webbankir';
UPDATE mfo_companies SET seo_description = 'Первый 0% • Продление займа' WHERE name = 'Joy.money';
UPDATE mfo_companies SET seo_description = 'Бесплатное продление • Cashback' WHERE name = 'CreditPlus';
UPDATE mfo_companies SET seo_description = 'Быстрое оформление • На любую карту' WHERE name = 'Pay P.S.';
