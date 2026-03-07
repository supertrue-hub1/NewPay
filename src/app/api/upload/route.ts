import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

// Настройки
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const UPLOAD_DIR = 'public/images/articles'

// Генерация уникального имени файла
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase()
  const timestamp = Date.now()
  const uuid = uuidv4().split('-')[0]
  return `${timestamp}-${uuid}${ext}`
}

// Создание таблицы изображений
async function createImagesTable() {
  const { query } = await import('@/lib/db')
  
  await query(`
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
    )
  `)
}

// GET - проверка работоспособности
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Upload API работает',
    maxSize: MAX_SIZE,
    allowedTypes: ALLOWED_TYPES
  })
}

// POST - загрузка файла
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Файл не загружен' },
        { status: 400 }
      )
    }

    // Валидация типа
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Недопустимый тип файла. Разрешены: JPG, PNG, WebP, GIF, SVG' },
        { status: 400 }
      )
    }

    // Валидация размера
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Файл слишком большой. Максимум 5MB' },
        { status: 400 }
      )
    }

    // Генерация имени файла
    const filename = generateFilename(file.name)
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR)

    // Создание директории если нет
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Чтение файла
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Получение размеров изображения (кроме SVG)
    let width = null
    let height = null

    if (file.type !== 'image/svg+xml') {
      try {
        const metadata = await sharp(buffer).metadata()
        width = metadata.width || null
        height = metadata.height || null
      } catch (e) {
        console.error('Error getting image metadata:', e)
      }
    }

    // Сохранение файла
    const filePath = path.join(uploadPath, filename)
    await writeFile(filePath, buffer)

    // Сохранение в БД
    const { query } = await import('@/lib/db')
    
    // Создаём таблицу если нет
    try {
      await createImagesTable()
    } catch (tableError: any) {
      if (!tableError.message?.includes('already exists')) {
        console.error('Error creating table:', tableError)
      }
    }

    const dbPath = `/images/articles/${filename}`
    
    const result = await query(
      `INSERT INTO images (filename, original_name, path, mime_type, size, width, height)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [filename, file.name, dbPath, file.type, file.size, width, height]
    )

    const image = result.rows[0]

    return NextResponse.json({
      success: true,
      data: {
        id: image.id,
        filename: image.filename,
        originalName: image.original_name,
        path: image.path,
        url: dbPath,
        mimeType: image.mime_type,
        size: image.size,
        width: image.width,
        height: image.height,
        createdAt: image.created_at,
      }
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка загрузки' },
      { status: 500 }
    )
  }
}
