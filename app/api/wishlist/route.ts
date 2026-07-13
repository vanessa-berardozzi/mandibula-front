import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pour GET/POST/DELETE /api/wishlist (racine)
 * Redirige vers le backend en préservant l'authentification
 */
async function makeProxyRequest(req: NextRequest, method: string) {
  const backendUrl = `${
    process.env.BACKEND_URL || 'https://mandibula-back.onrender.com'
  }/api/wishlist`;

  const cookieHeader = req.headers.get('cookie');
  console.log('[Wishlist Proxy Root]', { method, backendUrl, hasCookie: !!cookieHeader });

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');

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
    console.log('[Wishlist Proxy Root Response]', { status: res.status });
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[Wishlist Proxy Root Error]', error);
    return NextResponse.json(
      { error: 'Proxy error', details: String(error) },
      { status: 500 }
    );
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
