import type { NextConfig } from "next";

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
  async redirects() {
    return [
      {
        source: '/sluzby',
        destination: '/degustacie',
        permanent: true,
      },
      {
        source: '/moznost-spoluprace',
        destination: '/kontakt',
        permanent: true,
      },
      {
        source: '/obchod',
        destination: '/vina',
        permanent: true,
      },
      {
        source: '/vinarstvo',
        destination: '/o-nas',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/vina',
        permanent: true,
      },
      {
        source: '/cart',
        destination: '/kosik',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/pokladna',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
