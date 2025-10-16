import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for production
  reactStrictMode: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [], // Add your image domains here if needed
  },
  
  // Environment variables validation (optional)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  },
};

export default nextConfig;
