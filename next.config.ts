/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================
  // CONFIGURATION CACHE E-COMMERCE
  // ========================================
  
  // Désactiver cache fetch par défaut
  experimental: {
    // Next.js 15+ : contrôle granulaire du cache
    staleTimes: {
      dynamic: 0,      // Pas de cache pour routes dynamiques
      static: 0        // Pas de cache même pour pages statiques
    }
  },

  // Images optimisées
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'votre-cdn.com',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**'
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  // Headers sécurité
  async headers() {
    return [
      {
        // Appliquer à toutes les routes API
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store'
          }
        ]
      },
      {
        // Routes dynamiques (admin, account)
        source: '/(admin|account)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      },
      {
        // Headers sécurité globaux
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Redirections HTTPS en production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http'
            }
          ],
          destination: 'https://votredomaine.com/:path*',
          permanent: true
        }
      ]
    }
    return []
  },

  // Optimisations production
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  
  // Logging
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

module.exports = nextConfig