import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy pour les routes Better Auth
 * Redirige toutes les requêtes /api/auth/* vers le backend
 * Préserve les cookies et les headers pour l'authentification
 */
export async function handler(req: NextRequest) {
  // Extraire le chemin de la requête (ex: /sign-in/discord)
  const path = req.nextUrl.pathname.replace('/api/auth', '') || '/'
  const searchParams = req.nextUrl.search

  // URL du backend (variable serveur)
  const backendUrl = `${
    process.env.BACKEND_URL || 'https://mandibula-back.onrender.com'
  }/api/auth${path}${searchParams}`

  try {
    // Créer les headers pour la requête backend
    const headers = new Headers(req.headers)
    headers.delete('host') // Supprimer le header host original
    
    // IMPORTANT: Passer les cookies du frontend au backend
    const cookieHeader = req.headers.get('cookie')
    if (cookieHeader) {
      headers.set('cookie', cookieHeader)
    }

    // Déterminer le body
    let body: BodyInit | undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.arrayBuffer()
    }

    // Faire la requête au backend (sans ajouter credentials: 'include')
    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    })

    // Copier la réponse du backend
    const responseHeaders = new Headers(response.headers)
    
    // Gérer les redirects HTTP (301/302/307/308)
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location')
      if (location) {
        // Si c'est un redirect vers le backend root (/), rediriger vers le frontend home
        if (location === '/' || location === process.env.BACKEND_URL + '/') {
          return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
            status: 302
          })
        }
        return NextResponse.redirect(location, { status: response.status })
      }
    }
    
    // Gérer les cookies Set-Cookie dans la réponse
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      responseHeaders.set('set-cookie', setCookie)
    }

    // Récupérer le contenu en texte et retourner
    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('[Auth Proxy Error]', error)
    return NextResponse.json(
      { error: 'Erreur de proxy authentification' },
      { status: 500 }
    )
  }
}

export { handler as DELETE, handler as GET, handler as POST, handler as PUT }

