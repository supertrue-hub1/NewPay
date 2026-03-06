-- Добавление поля info_modal в таблицу mfo_companies
-- Выполните этот скрипт для обновления существующей базы данных

ALTER TABLE mfo_companies ADD COLUMN IF NOT EXISTS info_modal TEXT;

-- Проверка
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mfo_companies' AND column_name = 'info_modal';
