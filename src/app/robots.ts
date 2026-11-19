import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.appUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/search',
          '/reels',
          '/categories',
          '/listing/*',
          '/reels/*',
          '/profile/*',
          '/business/*',
        ],
        disallow: [
          '/chats',
          '/chats/*',
          '/notifications',
          '/notifications/*',
          '/wallet',
          '/wallet/*',
          '/boosted-content',
          '/boosted-content/*',
          '/sell',
          '/sell/*',
          '/favourites',
          '/login',
          '/register',
          '/verify-otp',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
