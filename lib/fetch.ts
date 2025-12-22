/**
 * Helper fetch centralisé avec gestion cache optimale
 * @module lib/fetch
 */

// ========================================
// TYPES
// ========================================

type FetchOptions = RequestInit & {
  cache?: RequestCache
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

interface APIError extends Error {
  status?: number
  statusText?: string
  data?: unknown
}

// ========================================
// CONFIGURATION
// ========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const DEFAULT_TIMEOUT = 30000 // 30 secondes

// ========================================
// HELPER PRINCIPAL
// ========================================

/**
 * Fetch API avec configuration cache optimale pour e-commerce
 * Par défaut : NO CACHE (données toujours fraîches)
 */
export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    cache = 'no-store', // ⚠️ CRITIQUE : pas de cache par défaut
    next,
    headers,
    ...restOptions
  } = options

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`

  // Timeout handler
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...restOptions,
      cache,
      next,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // Gestion erreurs HTTP
    if (!response.ok) {
      const error: APIError = new Error(
        `API Error: ${response.status} ${response.statusText}`
      )
      error.status = response.status
      error.statusText = response.statusText

      try {
        error.data = await response.json()
      } catch {
        error.data = await response.text()
      }

      throw error
    }

    // Parse response
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    return (await response.text()) as T
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${DEFAULT_TIMEOUT}ms`)
    }

    throw error
  }
}

// ========================================
// HELPERS SPÉCIALISÉS
// ========================================

/**
 * GET avec cache intelligent (pour catalogue produits public)
 * Revalidate toutes les heures
 */
export async function fetchCached<T = unknown>(
  endpoint: string,
  revalidate: number = 3600 // 1h par défaut
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    cache: 'force-cache',
    next: { revalidate }
  })
}

/**
 * GET sans cache (admin, temps réel)
 */
export async function fetchNoCache<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    cache: 'no-store'
  })
}

/**
 * POST (mutations toujours no-cache)
 */
export async function postAPI<T = unknown>(
  endpoint: string,
  data: unknown,
  options: FetchOptions = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store' // CRITIQUE : mutations = pas de cache
  })
}

/**
 * PUT (mutations toujours no-cache)
 */
export async function putAPI<T = unknown>(
  endpoint: string,
  data: unknown,
  options: FetchOptions = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store'
  })
}

/**
 * DELETE (mutations toujours no-cache)
 */
export async function deleteAPI<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'DELETE',
    cache: 'no-store'
  })
}

// ========================================
// HELPERS AUTH
// ========================================

/**
 * Fetch avec token JWT automatique
 */
export async function fetchWithAuth<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Récupérer token (adapter selon votre système auth)
  const token = getAuthToken() // Votre fonction pour récupérer le token

  return fetchAPI<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })
}

/**
 * Récupérer token auth (à adapter selon votre implémentation)
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null

  // Exemple : localStorage (à adapter)
  return localStorage.getItem('auth_token')

  // Ou cookies avec js-cookie
  // import Cookies from 'js-cookie'
  // return Cookies.get('auth_token')
}

// ========================================
// REVALIDATION CACHE (Server Actions)
// ========================================

/**
 * Invalider cache par tag (à utiliser après mutations)
 * À appeler dans Server Actions
 */

/*  TODO   
export async function invalidateCache(tags: string[]) {
  'use server'
  const { revalidateTag } = await import('next/cache')
  tags.forEach(tag => revalidateTag(tag))
}  */

/**
 * Invalider cache d'une route spécifique
 */
export async function invalidatePath(path: string) {
  'use server'
  const { revalidatePath } = await import('next/cache')
  revalidatePath(path)
}