import type { MetadataRoute } from 'next';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import { seoLandingPages } from '@/lib/seo-pages';

const HOME_LAST_MODIFIED = '2026-03-10';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getConfiguredAppUrl();

  return [
    {
      url: appUrl,
      lastModified: new Date(`${HOME_LAST_MODIFIED}T00:00:00.000Z`),
    },
    ...seoLandingPages.map((page) => ({
      url: createAppUrl(`/${page.slug}`, appUrl),
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
    })),
  ];
}
