import type { MetadataRoute } from 'next';
import { getConfiguredAppUrl } from '@/lib/app-url';

export default function sitemap(): MetadataRoute.Sitemap {
    const appUrl = getConfiguredAppUrl();

    return [
        {
            url: appUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];
}
