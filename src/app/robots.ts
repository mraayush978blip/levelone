import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/student/*',
          '/unauthorized',
          '/revoked',
        ],
      },
    ],
    sitemap: 'https://levelonedev.tech/sitemap.xml',
  };
}
