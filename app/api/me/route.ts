import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pour DELETE /api/me (suppression de compte)
 * Redirige vers le backend en préservant l'authentification
 */
export async function DELETE(req: NextRequest) {
  const backendUrl = `${
    process.env.BACKEND_URL || 'https://mandibula-back.onrender.com'
  }/api/me`;

  const cookieHeader = req.headers.get('cookie');

  try {
    const headers = new Headers(req.headers);
    headers.delete('host');
    if (cookieHeader) headers.set('cookie', cookieHeader);

    const res = await fetch(backendUrl, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[Me Proxy Error]', error);
    return NextResponse.json(
      { error: 'Proxy error', details: String(error) },
      { status: 500 }
    );
  }
}
