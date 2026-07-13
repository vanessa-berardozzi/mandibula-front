import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pour les routes wishlist
 * Redirige /api/wishlist/* vers le backend en préservant l'authentification
 */
function buildBackendUrl(req: NextRequest): string {
  // Extraire le chemin complet après /api/wishlist
  let path = req.nextUrl.pathname.replace('/api/wishlist', '');
  
  // Normaliser: pas de slash pour la racine, un slash au début sinon
  if (!path || path === '/') {
    path = '';
  }
  
  const searchParams = req.nextUrl.search;
  const backendBase = process.env.BACKEND_URL || 'https://mandibula-back.onrender.com';
  
  return `${backendBase}/api/wishlist${path}${searchParams}`;
}

async function makeProxyRequest(req: NextRequest, method: string) {
  const backendUrl = buildBackendUrl(req);
  const cookieHeader = req.headers.get('cookie');

  console.log('[Wishlist Proxy]', { method, backendUrl, hasCookie: !!cookieHeader });

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');

    // Transmettre les cookies d'authentification
    if (cookieHeader) {
      headers.set('cookie', cookieHeader);
    }

    let body: BodyInit | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await req.arrayBuffer();
    }

    const res = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    const data = await res.json();
    console.log('[Wishlist Proxy Response]', { status: res.status });
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[Wishlist Proxy Error]', error);
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return makeProxyRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return makeProxyRequest(req, 'POST');
}

export async function DELETE(req: NextRequest) {
  return makeProxyRequest(req, 'DELETE');
}
