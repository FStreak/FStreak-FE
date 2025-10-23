import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ⚠️ Xóa swcMinify vì Next.js 15 không còn hỗ trợ
  images: {
    domains: [],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  },

  typedRoutes: false, // ✅ fix bug validator typedRoutes
  eslint: {
    ignoreDuringBuilds: true, // ✅ cho phép build qua cả khi warning
  },
};

export default nextConfig;
