import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перенаправление /images/articles/* на API для раздачи загруженных файлов
  // Это нужно чтобы загруженные изображения работали на хостингах со статической раздачей
  if (pathname.startsWith('/images/articles/')) {
    const newPath = '/api/images/' + pathname.replace('/images/articles/', '')
    return NextResponse.rewrite(new URL(newPath, request.url))
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
