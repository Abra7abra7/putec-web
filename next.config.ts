import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'vino-putec-web.vercel.app' },
      { protocol: 'https', hostname: 'vinoputec.sk' },
    ],
  },
};

export default nextConfig;
