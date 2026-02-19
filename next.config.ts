import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts'); // Default path is './src/i18n/request.ts' but we used src/i18n.ts

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 70, 75, 80],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'vinoputec.sk' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'pub-049b5673c21f4cc291802dc6fc171c6c.r2.dev' },
    ],
  },
  // Redirects moved to proxy.ts
};

export default withNextIntl(nextConfig);
