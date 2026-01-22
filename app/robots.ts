import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: ['Googlebot', 'GPTBot', 'Bingbot'],
        allow: '/',
      }
    ],
    sitemap: 'https://vinoputec.sk/sitemap.xml',
  }
}
