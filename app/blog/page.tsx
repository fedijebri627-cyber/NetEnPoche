import type { Metadata } from 'next';
import { BlogIndexPageView, buildBlogIndexMetadata } from '@/components/landing/BlogPage';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = buildBlogIndexMetadata();

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return <BlogIndexPageView posts={posts} />;
}

