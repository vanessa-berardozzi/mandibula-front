import type { NextConfig } from "next"

const backendUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://mandibula-back.onrender.com"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
    ]
  },
}

export default nextConfig

