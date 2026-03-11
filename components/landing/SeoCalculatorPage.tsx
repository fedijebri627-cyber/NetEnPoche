import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { createAppUrl, getConfiguredAppUrl } from '@/lib/app-url';
import type { SeoCalculatorPage } from '@/lib/seo-calculator-pages';
import { PublicSeoCalculator } from '@/components/landing/PublicSeoCalculator';
import '@/app/landing.css';

const mandatoryLinks = [
  {
    href: '/simulateur-brut-net-auto-entrepreneur',
    title: 'Simulateur brut net auto-entrepreneur',
    description: 'Transformer un CA mensuel en net réel puis en équivalent salarié.',
  },
  {
    href: '/calcul-urssaf-auto-entrepreneur',
    title: 'Calcul URSSAF auto-entrepreneur',
    description: 'Comprendre les cotisations, la TVA et le vrai revenu disponible.',
  },
  {
    href: '/calcul-net-auto-entrepreneur',
    title: 'Calcul net auto-entrepreneur',
    description: 'Passer du chiffre d’affaires au net réellement conservé.',
  },
  {
    href: '/versement-liberatoire-auto-entrepreneur',
    title: 'Versement libératoire auto-entrepreneur',
    description: 'Comparer le barème classique et le versement libératoire.',
  },
  {
    href: '/',
    title: 'Landing NetEnPoche',
    description: 'Découvrir le produit complet et créer un compte gratuit.',
  },
] as const;

export function buildSeoCalculatorMetadata(page: SeoCalculatorPage): Metadata {
  const pageUrl = createAppUrl(`/${page.slug}`);

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
      languages: {
        fr: `/${page.slug}`,
        'fr-FR': `/${page.slug}`,
      },
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
          alt: 'NetEnPoche, simulateur freelance pour micro-entrepreneurs',
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

export function SeoCalculatorPageView({ page }: { page: SeoCalculatorPage }) {
  const appUrl = getConfiguredAppUrl();
  const pageUrl = createAppUrl(`/${page.slug}`, appUrl);
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

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: page.title,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Simulateur freelance pour micro-entrepreneurs',
    operatingSystem: 'Web',
    url: pageUrl,
    inLanguage: 'fr-FR',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    dateModified: page.updatedAt,
    datePublished: page.updatedAt,
    inLanguage: 'fr-FR',
    mainEntityOfPage: pageUrl,
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
        id={`calculator-seo-jsonld-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, softwareJsonLd, articleJsonLd, faqJsonLd]) }}
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
          <Link href="/#guides" className="nav-link">Guides</Link>
          <Link href="/auth/register" className="nav-cta">Créer mon compte</Link>
        </div>
      </nav>

      <section className="seo-tool-hero">
        <div className="seo-tool-hero-copy">
          <div className="hero-eyebrow">{page.heroEyebrow}</div>
          <h1 className="hero-title seo-hero-title">{page.heroTitle}</h1>
          <p className="hero-sub seo-hero-sub">{page.heroSubtitle}</p>
          <div className="seo-tool-points">
            {page.introPoints.map((point) => (
              <div key={point} className="seo-tool-point-card">
                <span className="seo-tool-point-mark">+</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="seo-tool-shell">
          <PublicSeoCalculator variant={page.variant} />
          <div className="seo-tool-cta-row">
            <span>Suivez ce calcul chaque mois automatiquement</span>
            <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit — c'est rapide</Link>
          </div>
        </div>
      </section>

      <section className="section seo-section-tight">
        <div className="seo-meta-grid">
          <article className="seo-meta-card">
            <div className="seo-meta-label">Mis à jour</div>
            <div className="seo-meta-value seo-meta-value--long">{page.updateNote}</div>

          </article>
          <article className="seo-meta-card">
            <div className="seo-meta-label">Ce que fait la page</div>
            <div className="seo-meta-value">Simuler + expliquer</div>
            <p>Le calcul est utilisable sans compte, le compte sert ensuite à suivre le résultat dans le temps.</p>
          </article>
          <article className="seo-meta-card">
            <div className="seo-meta-label">Sources citées</div>
            <div className="seo-meta-value">{page.officialSources.length} références</div>
            <p>Les règles officielles restent consultables avant la FAQ et les CTA produit.</p>
          </article>
        </div>
      </section>

      {page.examples && page.examples.length > 0 ? (
        <section className="section seo-section-tight">
          <div className="section-eyebrow">Exemples concrets</div>
          <h2 className="section-title">Trois repères rapides pour rendre le calcul tangible</h2>
          <div className="seo-example-grid">
            {page.examples.map((example) => (
              <article key={example.title} className="seo-example-card">
                <h3>{example.title}</h3>
                <p>{example.summary}</p>
                <div className="seo-example-values">
                  {example.values.map((value) => (
                    <div key={value.label} className="seo-example-value">
                      <span>{value.label}</span>
                      <strong>{value.value}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.sections.map((section, index) => (
        <section key={section.title} className="section seo-section-tight">
          <div className="section-eyebrow">{index < 2 ? 'Analyse' : index < 4 ? 'Repères' : 'Décision'}</div>
          <h2 className="section-title seo-calculator-section-title">{section.title}</h2>
          <div className="seo-calculator-copy-card">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul className="seo-calculator-bullets">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.table ? (
              <div className="seo-calculator-table-wrap">
                <table className="seo-calculator-table">
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell) => (
                          <td key={cell}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {index === 1 ? (
            <div className="seo-inline-cta">
              <div>
                <h3>Suivez votre net chaque mois</h3>
                <p>Le compte gratuit reprend le même calcul, ajoute la réserve et les alertes de pilotage.</p>
              </div>
              <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit</Link>
            </div>
          ) : null}
        </section>
      ))}

      <section className="section seo-section-tight" id="sources">
        <div className="section-eyebrow">Sources officielles</div>
        <h2 className="section-title">Les références publiques pour vérifier la règle</h2>
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
        <div className="section-eyebrow">FAQ</div>
        <h2 className="section-title">Questions fréquentes autour de cette simulation</h2>
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
        <div className="section-eyebrow">Liens internes utiles</div>
        <h2 className="section-title">Les pages à visiter juste après</h2>
        <div className="seo-guides-grid">
          {mandatoryLinks.map((link) => {
            const isCurrent = link.href === `/${page.slug}`;

            return isCurrent ? (
              <div key={link.href} className="seo-guide-card is-current">
                <div className="seo-guide-title">{link.title}</div>
                <p>{link.description}</p>
                <span>Page actuelle</span>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="seo-guide-card">
                <div className="seo-guide-title">{link.title}</div>
                <p>{link.description}</p>
                <span>Ouvrir la page</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="final-cta seo-final-cta">
        <h2 className="final-cta-title">Suivez votre net chaque mois au lieu de refaire le calcul à la main.</h2>
        <p className="final-cta-sub">
          Le simulateur est public. Le compte gratuit sert ensuite à garder l'historique, la réserve et les alertes au même endroit.
        </p>
        <Link href="/auth/register" className="btn-hero-primary">Suivre votre net chaque mois</Link>
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
          <Link href="/simulateur-brut-net-auto-entrepreneur" className="footer-link">Brut net auto-entrepreneur</Link>
          <Link href="/freelance-vs-salarie" className="footer-link">Freelance vs salarié</Link>
          <Link href="/calculateur-tjm" className="footer-link">Calculateur TJM</Link>
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




