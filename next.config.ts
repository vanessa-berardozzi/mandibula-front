import type { NextConfig } from "next"

const backendUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://mandibula-back.onrender.com"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.sumup.com', // Images produits SumUp
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com', // Discord avatars
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Facebook OAuth avatars
      },
      {
        protocol: 'https',
        hostname: 'scontent.xx.fbcdn.net', // Facebook CDN avatars
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: "/api/cart/:path*",
        destination: `${backendUrl}/api/cart/:path*`,
      },
      {
        source: "/api/products/:path*",
        destination: `${backendUrl}/api/products/:path*`,
      },
      {
        source: "/api/products",
        destination: `${backendUrl}/api/products`,
      },
    ]
  },
}

export default nextConfig

