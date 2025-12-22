import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Middleware global pour gérer cache headers
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const { pathname } = request.nextUrl

  // ========================================
  // ROUTES ADMIN/ACCOUNT : NO CACHE
  // ========================================
  if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // ========================================
  // ROUTES API : NO CACHE
  // ========================================
  if (pathname.startsWith('/api')) {
    response.headers.set(
      'Cache-Control',
      'no-store, must-revalidate'
    )
  }

  // ========================================
  // ROUTES PUBLIQUES : CACHE COURT
  // ========================================
  if (pathname.startsWith('/produits') && !pathname.includes('/api')) {
    // Cache 5 minutes pour catalogue produits
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    )
  }

  // ========================================
  // SÉCURITÉ : HEADERS
  // ========================================
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP (Content Security Policy)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.sumup.com",
      "frame-ancestors 'self'"
    ].join('; ')
  )

  return response
}

// ========================================
// CONFIG MIDDLEWARE
// ========================================
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}