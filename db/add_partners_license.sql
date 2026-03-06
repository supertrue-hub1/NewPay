-- Добавление колонки license в таблицу partners
ALTER TABLE partners ADD COLUMN IF NOT EXISTS license VARCHAR(255);

-- Обновление существующих записей с примерами лицензий
UPDATE partners SET license = 'Лицензия ЦБ РФ № 1481' WHERE name = 'Сбербанк';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 2673' WHERE name = 'Тинькофф';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 1326' WHERE name = 'Альфа-Банк';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 1000' WHERE name = 'ВТБ';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 650' WHERE name = 'Почта Банк';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 2292' WHERE name = 'Росбанк';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 2268' WHERE name = 'МТС Банк';
UPDATE partners SET license = 'Лицензия ЦБ РФ № 2766' WHERE name = 'ОТП Банк';
