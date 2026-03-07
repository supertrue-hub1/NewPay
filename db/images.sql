-- Таблица для хранения изображений
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    alt VARCHAR(500),
    article_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_images_article_id ON images(article_id);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_filename ON images(filename);

-- Комментарии к таблице
COMMENT ON TABLE images IS 'Хранилище изображений для статей и контента';
COMMENT ON COLUMN images.filename IS 'Уникальное имя файла (timestamp-uuid.ext)';
COMMENT ON COLUMN images.original_name IS 'Оригинальное имя файла пользователя';
COMMENT ON COLUMN images.path IS 'Путь относительно /public';
COMMENT ON COLUMN images.mime_type IS 'MIME тип файла';
COMMENT ON COLUMN images.size IS 'Размер файла в байтах';
COMMENT ON COLUMN images.width IS 'Ширина изображения в пикселях';
COMMENT ON COLUMN images.height IS 'Высота изображения в пикселях';
COMMENT ON COLUMN images.alt IS 'Alt текст для SEO';
