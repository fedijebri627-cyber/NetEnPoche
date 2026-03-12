import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  readTime: string;
  category: string;
  tags?: string[];
  excerpt?: string;
};

export type BlogPostPreview = BlogFrontmatter & {
  slug: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPosts(): BlogPostPreview[] {
  ensureBlogDir();

  const files = fs.readdirSync(BLOG_DIR);

  return sortByDateDesc(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map((filename) => {
        const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
        const { data } = matter(raw);

        return {
          slug: filename.replace(/\.mdx$/, ''),
          ...(data as BlogFrontmatter),
        };
      })
  );
}

export function getLatestPosts(limit = 3): BlogPostPreview[] {
  return getAllPosts().slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost {
  ensureBlogDir();

  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
  };
}

