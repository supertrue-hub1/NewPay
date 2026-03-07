import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

// Удаление изображения
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Получаем информацию о файле
    const result = await query(
      'SELECT * FROM images WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Изображение не найдено' },
        { status: 404 }
      )
    }

    const image = result.rows[0]

    // Удаляем файл
    try {
      const filePath = path.join(process.cwd(), 'public', image.path)
      await unlink(filePath)
    } catch (e) {
      console.error('Error deleting file:', e)
      // Продолжаем даже если файл не удалён
    }

    // Удаляем из БД
    await query('DELETE FROM images WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Изображение удалено'
    })
  } catch (error: any) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка удаления' },
      { status: 500 }
    )
  }
}

// Обновление alt текста
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { alt } = body

    const result = await query(
      `UPDATE images 
       SET alt = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [alt, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Изображение не найдено' },
        { status: 404 }
      )
    }

    const image = result.rows[0]

    return NextResponse.json({
      success: true,
      data: {
        id: image.id,
        alt: image.alt,
        updatedAt: image.updated_at,
      }
    })
  } catch (error: any) {
    console.error('Error updating image:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка обновления' },
      { status: 500 }
    )
  }
}
