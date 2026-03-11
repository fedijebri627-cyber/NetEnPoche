import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import { getSeoLandingPage, seoLandingPages, type SeoLandingPage } from '@/lib/seo-pages';
import '@/app/landing.css';

function formatUpdatedDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function buildSeoLandingMetadata(page: SeoLandingPage): Metadata {
  const pageUrl = createAppUrl(`/${page.slug}`);

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | NetEnPoche`,
      description: page.description,
      url: pageUrl,
      siteName: 'NetEnPoche',
      locale: 'fr_FR',
      type: 'article',
      images: [
        {
          url: '/brand/netenpoche-og-image.png',
          width: 1200,
          height: 630,
          alt: 'NetEnPoche, calculateur URSSAF pour micro-entrepreneurs',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | NetEnPoche`,
      description: page.description,
      images: ['/brand/netenpoche-og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function SeoLandingPageView({ page }: { page: SeoLandingPage }) {
  const appUrl = getConfiguredAppUrl();
  const pageUrl = createAppUrl(`/${page.slug}`, appUrl);
  const relatedPages = seoLandingPages.filter((entry) => entry.slug !== page.slug).slice(0, 3);
  const formattedUpdatedDate = formatUpdatedDate(page.updatedAt);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: appUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
        item: pageUrl,
      },
    ],
  };

  const webpageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: pageUrl,
    inLanguage: 'fr-FR',
    dateModified: page.updatedAt,
    isPartOf: {
      '@type': 'WebSite',
      name: 'NetEnPoche',
      url: appUrl,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="landing-page seo-page-shell">
      <Script
        id={`seo-jsonld-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, webpageJsonLd, faqJsonLd]) }}
      />

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
          <Link href="/#faq" className="nav-link">FAQ</Link>
          <Link href="/auth/register" className="nav-cta">Créer mon compte</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div className="seo-hero-inner">
          <div className="hero-eyebrow">{page.heroEyebrow}</div>
          <h1 className="hero-title seo-hero-title">{page.heroTitle}</h1>
          <p className="hero-sub seo-hero-sub">{page.heroSubtitle}</p>
          <div className="hero-actions seo-hero-actions">
            <Link href="/auth/register" className="btn-hero-primary">Essayer le simulateur</Link>
            <Link href="/" className="btn-hero-secondary">Retour à l’accueil</Link>
          </div>
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="seo-meta-grid">
          <article className="seo-meta-card">
            <div className="seo-meta-label">Mis à jour</div>
            <div className="seo-meta-value">{formattedUpdatedDate}</div>
            <p>Contenu revu avec les règles et parcours utilisateur de mars 2026.</p>
          </article>
          <article className="seo-meta-card">
            <div className="seo-meta-label">Positionnement</div>
            <div className="seo-meta-value">Guide explicatif</div>
            <p>NetEnPoche explique, projette et aide à piloter. La déclaration se fait toujours sur les sites officiels.</p>
          </article>
          <article className="seo-meta-card">
            <div className="seo-meta-label">Sources citées</div>
            <div className="seo-meta-value">{page.officialSources.length} références</div>
            <p>Chaque page renvoie vers les ressources publiques pertinentes avant la FAQ et les appels à l’action produit.</p>
          </article>
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="section-eyebrow">Ce que la page couvre</div>
        <h2 className="section-title">Les points que Google attend de voir sur cette requête</h2>
        <div className="seo-highlights-grid">
          {page.highlights.map((item) => (
            <div key={item} className="seo-highlight-card">
              <div className="seo-highlight-mark">+</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="section-eyebrow">Réponse éditoriale</div>
        <h2 className="section-title">Un contenu plus précis que le SERP actuel</h2>
        <div className="seo-copy-grid">
          {page.sections.map((section) => (
            <article key={section.title} className="seo-copy-card">
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section seo-section-tight" id="sources">
        <div className="section-eyebrow">Sources officielles</div>
        <h2 className="section-title">Les références publiques utiles pour vérifier la règle</h2>
        <div className="seo-sources-grid">
          {page.officialSources.map((source) => (
            <article key={source.url} className="seo-source-card">
              <div className="seo-source-publisher">{source.publisher}</div>
              <h3>{source.title}</h3>
              <a href={source.url} target="_blank" rel="noopener noreferrer">Ouvrir la source officielle</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section seo-section-tight" id="faq">
        <div className="section-eyebrow">Questions fréquentes</div>
        <h2 className="section-title">FAQ liée à cette intention de recherche</h2>
        <div className="seo-faq-list">
          {page.faq.map((item) => (
            <article key={item.question} className="seo-faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="section-eyebrow">Autres guides utiles</div>
        <h2 className="section-title">Poursuivre vers des questions plus ciblées</h2>
        <div className="seo-guides-grid">
          {relatedPages.map((relatedPage) => (
            <Link key={relatedPage.slug} href={`/${relatedPage.slug}`} className="seo-guide-card">
              <div className="seo-guide-title">{relatedPage.cardTitle}</div>
              <p>{relatedPage.cardDescription}</p>
              <span>Voir le guide</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="final-cta seo-final-cta">
        <h2 className="final-cta-title">Passez du calcul théorique à une vision exploitable.</h2>
        <p className="final-cta-sub">
          Créez un compte gratuit pour visualiser vos cotisations URSSAF, la TVA et votre net après impôt sur la même interface.
        </p>
        <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit</Link>
      </section>

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
          <Link href="/calcul-urssaf" className="footer-link">Calcul URSSAF</Link>
          <Link href="/tva-micro-entreprise" className="footer-link">TVA micro-entreprise</Link>
          <Link href="/versement-liberatoire-auto-entrepreneur" className="footer-link">Versement libératoire</Link>
          <Link href="/cgu" className="footer-link">CGU</Link>
          <Link href="/rgpd" className="footer-link">RGPD</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
          <Link href="/auth/login" className="footer-link">Connexion</Link>
        </div>
        <span>Copyright 2026 NetEnPoche. Tous droits réservés.</span>
      </footer>
    </div>
  );
}

export function getSeoLandingPageOrThrow(slug: string) {
  const page = getSeoLandingPage(slug);

  if (!page) {
    throw new Error(`Unknown SEO landing page: ${slug}`);
  }

  return page;
}
