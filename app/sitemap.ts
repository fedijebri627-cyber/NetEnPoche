import type { MetadataRoute } from 'next';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import { seoLandingPages } from '@/lib/seo-pages';

export default function sitemap(): MetadataRoute.Sitemap {
    const appUrl = getConfiguredAppUrl();
    const now = new Date();

    return [
        {
            url: appUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...seoLandingPages.map((page) => ({
            url: createAppUrl(`/${page.slug}`, appUrl),
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        })),
    ];
}