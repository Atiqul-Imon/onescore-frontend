import { MetadataRoute } from 'next';

// Prioritize production domain - never use Vercel preview URLs
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.scorenews.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/register',
          '/maintenance',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/register', '/maintenance'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
