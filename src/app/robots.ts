import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/counter', '/supervisor', '/driver', '/payment/sandbox-checkout'],
    },
    sitemap: 'https://metro-probati-platform.vercel.app/sitemap.xml',
  };
}
