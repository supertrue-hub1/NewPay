// For static export, we disable the middleware
// Geo-personalization will need to be handled client-side or via CDN

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if we're in static export mode
const isStaticExport = process.env.STATIC_EXPORT === 'true';

// For static export, return a simple response that lets the client handle routing
export function middleware(request: NextRequest) {
  // Skip middleware for static export (handled by client-side)
  if (isStaticExport) {
    return NextResponse.next();
  }
  
  // For dynamic mode, we would import and use the i18n middleware
  // But for now, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, sitemap.xml, robots.txt etc.
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
