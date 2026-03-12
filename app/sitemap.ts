import type { MetadataRoute } from 'next';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import { getAllPosts } from '@/lib/blog';
import { seoLandingPages } from '@/lib/seo-pages';
import { seoCalculatorPages } from '@/lib/seo-calculator-pages';

const HOME_LAST_MODIFIED = '2026-03-10';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getConfiguredAppUrl();
  const allGuidePages = [...seoLandingPages, ...seoCalculatorPages];
  const blogPosts = getAllPosts();
  const latestBlogDate = blogPosts[0]?.updatedAt || blogPosts[0]?.date || HOME_LAST_MODIFIED;

  return [
    {
      url: appUrl,
      lastModified: new Date(`${HOME_LAST_MODIFIED}T00:00:00.000Z`),
    },
    {
      url: createAppUrl('/blog', appUrl),
      lastModified: new Date(`${latestBlogDate}T00:00:00.000Z`),
    },
    ...allGuidePages.map((page) => ({
      url: createAppUrl(`/${page.slug}`, appUrl),
      lastModified: new Date(`${page.updatedAt}T00:00:00.000Z`),
    })),
    ...blogPosts.map((post) => ({
      url: createAppUrl(`/blog/${post.slug}`, appUrl),
      lastModified: new Date(`${post.updatedAt || post.date}T00:00:00.000Z`),
    })),
  ];
}

