import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import type { BlogPost, BlogPostPreview } from '@/lib/blog';
import '@/app/landing.css';

const formatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatDate(date: string) {
  return formatter.format(new Date(`${date}T00:00:00.000Z`));
}

function renderNav() {
  return (
    <nav className="landing-nav">
      <Link href="/" className="nav-logo">
        <Image
          src="/brand/netenpoche-logo-transparent.png"
          alt="NetEnPoche"
          width={200}
          height={52}
          priority
          className="h-10 w-auto"
        />
      </Link>
      <div className="nav-links">
        <Link href="/#features" className="nav-link">Fonctionnalités</Link>
        <Link href="/#pricing" className="nav-link">Tarifs</Link>
        <Link href="/blog" className="nav-link">Blog</Link>
        <Link href="/auth/register" className="nav-cta">Créer mon compte</Link>
      </div>
    </nav>
  );
}

function renderFooter() {
  return (
    <footer>
      <Link href="/" className="nav-logo footer-brand" aria-label="NetEnPoche accueil">
        <Image
          src="/brand/netenpoche-logo-transparent.png"
          alt="NetEnPoche"
          width={160}
          height={42}
          className="h-8 w-auto"
        />
      </Link>
      <div className="footer-links">
        <Link href="/blog" className="footer-link">Blog</Link>
        <Link href="/simulateur-brut-net-auto-entrepreneur" className="footer-link">Brut net auto-entrepreneur</Link>
        <Link href="/calculateur-tjm" className="footer-link">Calculateur TJM</Link>
        <Link href="/cgu" className="footer-link">CGU</Link>
        <Link href="/rgpd" className="footer-link">RGPD</Link>
        <Link href="/contact" className="footer-link">Contact</Link>
      </div>
      <span>Copyright 2026 NetEnPoche. Tous droits réservés.</span>
    </footer>
  );
}

export function buildBlogIndexMetadata(): Metadata {
  return {
    title: 'Blog freelance et micro-entreprise 2026',
    description:
      'Des articles clairs pour mieux piloter son activité freelance ou micro-entreprise : URSSAF, impôt, TVA, TJM et vrai net.',
    alternates: {
      canonical: '/blog',
      languages: {
        fr: '/blog',
        'fr-FR': '/blog',
      },
    },
    openGraph: {
      title: 'Blog freelance et micro-entreprise 2026',
      description:
        'Des articles clairs pour mieux piloter son activité freelance ou micro-entreprise : URSSAF, impôt, TVA, TJM et vrai net.',
      url: createAppUrl('/blog'),
      siteName: 'NetEnPoche',
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: '/brand/netenpoche-og-image.png',
          width: 1200,
          height: 630,
          alt: 'Blog NetEnPoche',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog freelance et micro-entreprise 2026',
      description:
        'Des articles clairs pour mieux piloter son activité freelance ou micro-entreprise : URSSAF, impôt, TVA, TJM et vrai net.',
      images: ['/brand/netenpoche-og-image.png'],
    },
  };
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: {
        fr: `/blog/${post.slug}`,
        'fr-FR': `/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: createAppUrl(`/blog/${post.slug}`),
      siteName: 'NetEnPoche',
      locale: 'fr_FR',
      type: 'article',
      images: [
        {
          url: '/brand/netenpoche-og-image.png',
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: ['/brand/netenpoche-og-image.png'],
    },
  };
}

export function BlogIndexPageView({ posts }: { posts: BlogPostPreview[] }) {
  const appUrl = getConfiguredAppUrl();
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog NetEnPoche',
    url: createAppUrl('/blog', appUrl),
    inLanguage: 'fr-FR',
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: createAppUrl(`/blog/${post.slug}`, appUrl),
      datePublished: post.date,
      dateModified: post.updatedAt || post.date,
    })),
  };

  return (
    <div className="landing-page seo-page-shell blog-page-shell">
      <Script
        id="blog-index-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {renderNav()}

      <section className="blog-index-hero">
        <div className="blog-index-hero-inner">
          <div className="hero-eyebrow">Blog NetEnPoche</div>
          <h1 className="hero-title blog-index-title">Des articles utiles pour piloter votre activité, pas pour remplir un flux.</h1>
          <p className="hero-sub blog-index-sub">
            URSSAF, TVA, impôt, TJM, net réel et choix fiscaux. Le blog complète les simulateurs publics avec des analyses plus calmes,
            plus concrètes et plus actionnables.
          </p>
          <div className="seo-tool-points blog-index-points">
            <div className="seo-tool-point-card"><span className="seo-tool-point-mark">+</span><p>Des guides écrits pour les freelances et micro-entrepreneurs français.</p></div>
            <div className="seo-tool-point-card"><span className="seo-tool-point-mark">+</span><p>Des articles reliés aux calculateurs et aux pages SEO déjà en ligne.</p></div>
            <div className="seo-tool-point-card"><span className="seo-tool-point-mark">+</span><p>Une base éditoriale qui peut grandir sans dépendre d’un CMS lourd.</p></div>
          </div>
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="section-eyebrow">Derniers articles</div>
        <h2 className="section-title">Les sujets à publier et à faire vivre dans le temps</h2>
        <div className="blog-index-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-index-card">
              <div className="blog-index-meta-row">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt || post.description}</p>
              <div className="blog-index-footer-row">
                <span>{formatDate(post.date)}</span>
                <strong>Lire l'article</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="final-cta seo-final-cta">
        <h2 className="final-cta-title">Le blog attire le trafic. Le produit aide à agir ensuite.</h2>
        <p className="final-cta-sub">Chaque article renvoie vers un calcul concret, puis vers le compte gratuit pour suivre le net dans le temps.</p>
        <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit</Link>
      </section>

      {renderFooter()}
    </div>
  );
}

export function BlogPostPageView({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPostPreview[] }) {
  const appUrl = getConfiguredAppUrl();
  const pageUrl = createAppUrl(`/blog/${post.slug}`, appUrl);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: appUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: createAppUrl('/blog', appUrl) },
      { '@type': 'ListItem', position: 3, name: post.frontmatter.title, item: pageUrl },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updatedAt || post.frontmatter.date,
    mainEntityOfPage: pageUrl,
    inLanguage: 'fr-FR',
    author: {
      '@type': 'Organization',
      name: 'NetEnPoche',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NetEnPoche',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/brand/netenpoche-icon-1024.png`,
      },
    },
  };

  return (
    <div className="landing-page seo-page-shell blog-page-shell">
      <Script
        id={`blog-post-jsonld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, articleJsonLd]) }}
      />
      {renderNav()}

      <section className="blog-post-hero">
        <div className="blog-post-hero-inner">
          <div className="hero-eyebrow">{post.frontmatter.category}</div>
          <h1 className="hero-title blog-post-title">{post.frontmatter.title}</h1>
          <p className="hero-sub blog-post-sub">{post.frontmatter.description}</p>
          <div className="blog-post-meta-row">
            <span>{formatDate(post.frontmatter.date)}</span>
            <span>{post.frontmatter.readTime}</span>
            {post.frontmatter.tags?.map((tag) => (
              <span key={tag} className="blog-post-tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section seo-section-tight blog-article-shell">
        <article className="blog-article-card">
          <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </article>
      </section>

      <section className="section seo-section-tight">
        <div className="section-eyebrow">À lire ensuite</div>
        <h2 className="section-title">Continuez avec les articles et outils les plus proches</h2>
        <div className="blog-index-grid">
          {relatedPosts.map((relatedPost) => (
            <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="blog-index-card">
              <div className="blog-index-meta-row">
                <span>{relatedPost.category}</span>
                <span>{relatedPost.readTime}</span>
              </div>
              <h3>{relatedPost.title}</h3>
              <p>{relatedPost.excerpt || relatedPost.description}</p>
              <div className="blog-index-footer-row">
                <span>{formatDate(relatedPost.date)}</span>
                <strong>Lire l'article</strong>
              </div>
            </Link>
          ))}
          <Link href="/simulateur-brut-net-auto-entrepreneur" className="blog-index-card blog-index-card--cta">
            <div className="blog-index-meta-row">
              <span>Calculateur</span>
              <span>Public</span>
            </div>
            <h3>Passer de l'article au calcul</h3>
            <p>Utilisez le simulateur brut net auto-entrepreneur pour transformer ces conseils en chiffres concrets.</p>
            <div className="blog-index-footer-row">
              <span>Sans compte</span>
              <strong>Ouvrir le simulateur</strong>
            </div>
          </Link>
        </div>
      </section>

      <section className="final-cta seo-final-cta">
        <h2 className="final-cta-title">Gardez le calcul, l'historique et les alertes au même endroit.</h2>
        <p className="final-cta-sub">Le blog répond à la question. Le compte gratuit vous aide ensuite à suivre votre vrai net chaque mois.</p>
        <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit</Link>
      </section>

      {renderFooter()}
    </div>
  );
}
