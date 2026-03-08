import type { MetadataRoute } from 'next';
import { getConfiguredAppUrl } from '@/lib/app-url';

export default function robots(): MetadataRoute.Robots {
    const appUrl = getConfiguredAppUrl();

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/'],
            },
        ],
        sitemap: `${appUrl}/sitemap.xml`,
        host: appUrl,
    };
}
