import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // Безопасность - только alphanumeric и расширения изображений
    if (!/^[\w\-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', 'images', 'articles', filename)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const file = await readFile(filePath)
    
    const ext = path.extname(filename).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }
    
    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
