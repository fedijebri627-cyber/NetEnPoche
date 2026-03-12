import { notFound } from 'next/navigation';
import { BlogPostPageView, buildBlogPostMetadata } from '@/components/landing/BlogPage';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return buildBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    const relatedPosts = getAllPosts().filter((item) => item.slug !== slug).slice(0, 2);

    return <BlogPostPageView post={post} relatedPosts={relatedPosts} />;
  } catch {
    notFound();
  }
}

