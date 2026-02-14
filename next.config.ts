import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts'); // Default path is './src/i18n/request.ts' but we used src/i18n.ts

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'vino-putec-web.vercel.app' },
      { protocol: 'https', hostname: 'vinoputec.sk' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ],
  },
  // Redirects moved to proxy.ts
};

export default withNextIntl(nextConfig);
