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
        userAgent: ['Googlebot', 'GPTBot', 'Bingbot', 'CCBot', 'Google-Extended', 'Anthropic-AI', 'Applebot-Extended', 'PerplexityBot', 'ClaudeBot', 'Claude-Web', 'cohere-ai', 'Omgilibot', 'FacebookBot', 'OAI-SearchBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://vinoputec.sk/sitemap.xml',
  }
}
