/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { FAQSection } from '@/components/landing/FAQSection';
import { faqData } from '@/components/landing/faqData';
import { PricingSection } from '@/components/landing/PricingSection';
import { getConfiguredAppUrl } from '@/lib/app-url';
import { seoLandingPages } from '@/lib/seo-pages';
import './landing.css';

const appUrl = getConfiguredAppUrl();
const homeTitle = 'Calculateur URSSAF, TVA et impôt pour micro-entrepreneurs';
const homeDescription =
  'NetEnPoche est un calculateur URSSAF pour auto-entrepreneurs et micro-entrepreneurs français. Calculez votre net après cotisations, TVA et impôt sur le revenu en temps réel.';

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  keywords: [
    'netenpoche',
    'calculateur urssaf',
    'simulateur urssaf auto entrepreneur',
    'micro entrepreneur urssaf',
    'calcul net auto entrepreneur',
    'tva micro entreprise',
    'impot auto entrepreneur',
    'micro entrepreneur france',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${homeTitle} | NetEnPoche`,
    description: homeDescription,
    url: appUrl,
    siteName: 'NetEnPoche',
    locale: 'fr_FR',
    type: 'website',
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
    title: `${homeTitle} | NetEnPoche`,
    description: homeDescription,
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

export default function LandingPage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NetEnPoche',
    url: appUrl,
    logo: `${appUrl}/brand/netenpoche-icon-1024.png`,
    description: homeDescription,
    areaServed: 'FR',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NetEnPoche',
    url: appUrl,
    inLanguage: 'fr-FR',
    description: homeDescription,
  };

  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NetEnPoche',
    operatingSystem: 'Web',
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Calculateur URSSAF pour micro-entrepreneurs',
    url: appUrl,
    description: homeDescription,
    areaServed: 'FR',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '0',
      highPrice: '140',
      offerCount: '3',
    },
    featureList: [
      'Calcul URSSAF en temps réel',
      'Suivi du plafond de TVA',
      "Estimateur d'impôt sur le revenu",
      'Alertes échéances URSSAF',
      'Bilan PDF professionnel',
      'Suivi clients et factures',
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const structuredData = [organizationJsonLd, websiteJsonLd, softwareApplicationJsonLd, faqJsonLd];

  return (
    <div className="landing-page">
      <Script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* NAV */}
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
          <a href="#features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link href="/auth/register" className="nav-cta">Créer mon compte</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Calculateur URSSAF 2026 pour micro-entrepreneurs français</div>
        <h1 className="hero-title">
          Calculateur URSSAF, TVA et impôt<br /><span className="highlight">pour connaître votre vrai net</span>
        </h1>
        <p className="hero-sub">
          NetEnPoche aide les auto-entrepreneurs à calculer leur net après cotisations sociales, TVA et impôt sur le revenu. Suivez votre chiffre d'affaires, anticipez vos échéances et évitez les mauvaises surprises de fin d'année.
        </p>
        <div className="hero-actions">
          <Link href="/auth/register" className="btn-hero-primary">Essayer gratuitement</Link>
          <a href="#pricing" className="btn-hero-secondary">Comparer les offres</a>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item"><span className="hero-trust-dot">●</span> Gratuit pour toujours</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">●</span> Aucune carte requise</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">●</span> Données chiffrées SSL</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">●</span> Non affilié à l'URSSAF</div>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-preview">
          <div className="preview-glow"></div>
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="flex gap-1.5 px-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <Image
                  src="/brand/netenpoche-favicon-32.png"
                  alt=""
                  width={16}
                  height={16}
                  className="ml-2 rounded-sm opacity-70"
                />
                <span className="text-xs text-white/30 ml-1">
                  netenpoche.fr — Tableau de bord 2026
                </span>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-kpi">
                <div className="preview-kpi-label">💸 URSSAF à payer</div>
                <div className="preview-kpi-value" style={{ color: '#e84040' }}>7 092 €</div>
                <div className="preview-kpi-trend" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Sur l'année</div>
              </div>
              <div className="preview-kpi">
                <div className="preview-kpi-label">🏦 Net en poche</div>
                <div className="preview-kpi-value" style={{ color: '#00c875' }}>26 520 €</div>
                <div className="preview-kpi-trend" style={{ color: '#00c875', fontSize: 11 }}>↑ Revenu YTD</div>
              </div>
              <div className="preview-kpi">
                <div className="preview-kpi-label">🔮 Projection annuelle</div>
                <div className="preview-kpi-value" style={{ color: '#a5b4fc' }}>~63 500 €</div>
                <div className="preview-kpi-trend" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>À ce rythme</div>
              </div>
              <div className="preview-bar-chart">
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 8, background: '#e84040', borderRadius: 2 }} />
                    <div className="bar-seg" style={{ height: 20, background: '#00c875', borderRadius: 0 }} />
                  </div>
                  <div className="bar-label">Jan</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 14, background: '#e84040' }} />
                    <div className="bar-seg" style={{ height: 52, background: '#00c875' }} />
                  </div>
                  <div className="bar-label">Fév</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 15, background: '#e84040' }} />
                    <div className="bar-seg" style={{ height: 55, background: '#00c875' }} />
                  </div>
                  <div className="bar-label">Mar</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 18, background: '#e84040' }} />
                    <div className="bar-seg" style={{ height: 62, background: '#00c875' }} />
                  </div>
                  <div className="bar-label">Avr</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 14, background: '#e84040' }} />
                    <div className="bar-seg" style={{ height: 50, background: '#1f3660' }} />
                  </div>
                  <div className="bar-label" style={{ color: '#f5a623' }}>Mai ⚠</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px dashed rgba(165,180,252,0.4)' }} />
                    <div className="bar-seg" style={{ height: 48, background: 'rgba(165,180,252,0.1)', border: '1px dashed rgba(165,180,252,0.3)' }} />
                  </div>
                  <div className="bar-label" style={{ color: 'rgba(165,180,252,0.5)' }}>Jun</div>
                </div>
                <div className="bar-group">
                  <div className="bar-stack">
                    <div className="bar-seg" style={{ height: 48, background: 'rgba(165,180,252,0.07)', border: '1px dashed rgba(165,180,252,0.2)' }} />
                  </div>
                  <div className="bar-label" style={{ color: 'rgba(165,180,252,0.3)' }}>Jul</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF NUMBERS */}
      <div className="proof-section">
        <div className="proof-inner">
          <div className="proof-stat">
            <div className="proof-number">4,2 M</div>
            <div className="proof-label">micro-entrepreneurs en France<br />concernés par l'URSSAF et la TVA</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">0 €</div>
            <div className="proof-label">pour commencer à calculer<br />votre vrai net après charges</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">2026</div>
            <div className="proof-label">règles et projections fiscales<br />pour mieux piloter votre activité</div>
          </div>
        </div>
      </div>

      <section className="section intent-section" id="intent">
        <div className="section-eyebrow">Ce que calcule NetEnPoche</div>
        <h2 className="section-title">Les vraies questions d'un auto-entrepreneur, traitées au même endroit</h2>
        <p className="section-sub">Le site répond aux recherches les plus fréquentes autour de l'URSSAF, de la TVA et du net micro-entrepreneur, sans vous obliger à jongler entre plusieurs simulateurs.</p>

        <div className="intent-grid">
          <div className="intent-card">
            <div className="intent-title">Calculer votre net après URSSAF</div>
            <div className="intent-text">Visualisez immédiatement les cotisations sociales et ce qu'il vous reste vraiment après prélèvements.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Anticiper le plafond de TVA</div>
            <div className="intent-text">Suivez la franchise en base de TVA et repérez le bon moment pour ajuster vos factures.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Estimer l'impôt sur le revenu</div>
            <div className="intent-text">Projetez votre net après impôt selon votre situation fiscale, vos parts et votre activité.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Piloter votre activité freelance</div>
            <div className="intent-text">Alertes, bilan PDF, suivi clients et factures pour passer du simple calcul à une vraie vision financière.</div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="section" id="how-it-works">
        <div className="section-eyebrow">Comment ça marche</div>
        <h2 className="section-title">En 3 étapes simples</h2>
        <p className="section-sub">Un outil de calcul net auto-entrepreneur conçu pour vous simplifier la vie, pas l'inverse.</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-title">Saisissez votre CA</div>
            <div className="step-text">Entrez simplement votre chiffre d'affaires mensuel. Pas de jargon comptable, pas de tableur compliqué.</div>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-title">On calcule tout</div>
            <div className="step-text">Cotisations sociales, plafond TVA micro-entreprise, impôt sur le revenu (simulateur URSSAF 2026 inclus) — tout s'actualise instantanément.</div>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-title">Vous gardez le contrôle</div>
            <div className="step-text">Des alertes par email avant les échéances, et un bilan PDF pour optimiser votre rentabilité et développer votre activité sans crainte.</div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="section" id="features">
        <div className="section-eyebrow">Le problème</div>
        <h2 className="section-title">La question que tout freelance se pose<br />sans jamais trouver la réponse exacte</h2>
        <p className="section-sub">Les outils existent. Mais aucun ne vous dit simplement combien il vous reste après avoir tout payé.</p>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-emoji">😰</div>
            <div className="problem-title">La surprise de fin d'année</div>
            <div className="problem-text">Vous avez bien gagné votre vie — mais les impôts arrivent et le chiffre ne ressemble plus à ce que vous pensiez garder. L'impôt sur le revenu auto-entrepreneur calcul est trop complexe.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">📊</div>
            <div className="problem-title">Le plafond TVA invisible</div>
            <div className="problem-text">Vous êtes en franchise de TVA, et soudain vous réalisez que vous avez dépassé le seuil en juin. Vous deviez facturer la TVA depuis le 1er janvier.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">🧮</div>
            <div className="problem-title">Excel ne suffit plus</div>
            <div className="problem-text">Votre tableau fonctionne pour l'URSSAF, mais il ne tient pas compte de votre tranche IR, de votre foyer fiscal, ni de votre abattement réel. Le vrai chiffre reste flou.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-eyebrow">La solution</div>
          <h2 className="section-title">Tout ce dont un micro-entrepreneur<br />a besoin, au même endroit</h2>

          <div className="features-grid">
            <div className="feature-list">
              <div className="feature-item" style={{ cursor: 'default' }}>
                <div className="feature-icon">🧮</div>
                <div>
                  <div className="feature-text-title">Calcul URSSAF en temps réel <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Saisissez votre CA mois par mois. URSSAF, net en poche, provision CFE — tout se calcule instantanément avec les taux 2026.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div>
                  <div className="feature-text-title">Suivi plafond TVA <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Une barre de progression visuelle qui vire à l'orange puis au rouge. Vous saurez exactement quand agir.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <div>
                  <div className="feature-text-title">Estimateur Impôt sur le Revenu <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Le calcul que personne d'autre ne fait. Votre vrai net après IR, selon votre foyer fiscal, vos parts et votre tranche marginale.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🗓️</div>
                <div>
                  <div className="feature-text-title">Calendrier URSSAF & alertes email <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Dates d'échéance, montants par trimestre, et emails automatiques 14 jours avant chaque paiement.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📄</div>
                <div>
                  <div className="feature-text-title">Bilan PDF professionnel <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Un document prêt pour votre banque, votre bailleur ou votre comptable. Couverture, tableaux, graphiques intégrés.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🧾</div>
                <div>
                  <div className="feature-text-title">Suivi clients & factures <span className="feature-badge badge-expert">Expert</span></div>
                  <div className="feature-text-desc">Enregistrez vos clients et factures. Le CA mensuel se renseigne automatiquement. Alertes sur les factures en retard.</div>
                </div>
              </div>
            </div>

            {/* IR Visual */}
            <div className="feature-visual">
              <div className="fv-title">💰 Votre vrai net après impôts</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Basé sur votre CA 2026 · Célibataire · 1 part</div>

              <div className="waterfall">
                <div className="wf-row">
                  <div className="wf-label">CA annuel brut</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '100%', background: 'rgba(255,255,255,0.15)' }} /></div>
                  <div className="wf-value">33 613 €</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">− URSSAF (21.1%)</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '21%', background: '#e84040' }} /></div>
                  <div className="wf-value" style={{ color: '#e84040' }}>− 7 092 €</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">− Abattement (34%)</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '34%', background: 'rgba(245,166,35,0.6)' }} /></div>
                  <div className="wf-value" style={{ color: 'rgba(245,166,35,0.8)' }}>− 11 428 €</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">− Impôt sur le revenu</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '8%', background: '#f59e0b' }} /></div>
                  <div className="wf-value" style={{ color: '#f59e0b' }}>− 1 647 €</div>
                </div>
              </div>

              <div className="wf-final">
                <div>
                  <div className="wf-final-label">✓ NET RÉEL EN POCHE</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,200,117,0.6)', marginTop: 2 }}>Après URSSAF + IR · 2026</div>
                </div>
                <div className="wf-final-value">24 874 €</div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 11, color: 'rgba(165,180,252,0.8)', marginBottom: 4 }}>💡 Comparaison versement libératoire</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Avec VL :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#a5b4fc' }}>25 213 €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sans VL :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#00c875' }}>24 874 €</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 6 }}>→ Le versement libératoire vous économise 339 €/an</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section" id="compare">
        <div className="section-eyebrow">Comparaison</div>
        <h2 className="section-title">Pourquoi choisir NetEnPoche ?</h2>
        <div className="comp-wrapper">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th className="comp-me">NetEnPoche Pro</th>
                <th>Fichier Excel</th>
                <th>Outil Comptable (Indy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prix</td>
                <td className="comp-me">5 € / mois</td>
                <td>Gratuit (ou temps personnel)</td>
                <td>~24 € / mois</td>
              </tr>
              <tr>
                <td>Calcul IR & Foyer Fiscal</td>
                <td className="comp-me">Exclusivité intégrée</td>
                <td>Rarement fonctionnel</td>
                <td>Non (orienté entreprise)</td>
              </tr>
              <tr>
                <td>Simplicité d'utilisation</td>
                <td className="comp-me">Aucun jargon</td>
                <td>Complexe à paramétrer</td>
                <td>Lourd et connecté aux banques</td>
              </tr>
              <tr>
                <td>Alertes automatiques</td>
                <td className="comp-me">Emails URSSAF & TVA</td>
                <td>Aucune alerte</td>
                <td>Rappels généraux</td>
              </tr>
              <tr>
                <td>Bilan Financier Pro PDF</td>
                <td className="comp-me">En 1 clic</td>
                <td>Non supporté</td>
                <td>Formats comptables complexes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PRICING */}
      <PricingSection />

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>Témoignages</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Ce que disent les freelances<br />qui l'utilisent</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <div className="testimonial-text">"Enfin un outil qui me dit combien je garde vraiment après les impôts. J'ai évité une mauvaise surprise de 2 300 € grâce à la projection annuelle."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">ML</div>
              <div>
                <div className="testimonial-name">Marie L.</div>
                <div className="testimonial-role">Consultante RH · Paris</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <div className="testimonial-text">"L'alerte TVA m'a sauvé la mise. J'étais à 92% du plafond et je ne m'en étais pas rendu compte. Sans NetEnPoche, j'aurais eu une régularisation salée."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">TK</div>
              <div>
                <div className="testimonial-name">Thomas K.</div>
                <div className="testimonial-role">Dev freelance · Lyon</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★☆</div>
            <div className="testimonial-text">"Le bilan PDF m'a permis d'obtenir mon appartement sans garant. La banque et le bailleur ont accepté le document sans demander d'autres justificatifs."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">SA</div>
              <div>
                <div className="testimonial-name">Sofia A.</div>
                <div className="testimonial-role">Graphiste · Bordeaux</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="guides">
        <div className="section-eyebrow">Guides cibles</div>
        <h2 className="section-title">Des pages dediees aux requetes SEO que vous pouvez vraiment gagner</h2>
        <p className="section-sub">Au lieu de viser seulement la requete institutionnelle "calcul URSSAF", NetEnPoche cree aussi des points d entree plus precis pour les micro-entrepreneurs qui cherchent un resultat exploitable.</p>
        <div className="seo-guides-grid">
          {seoLandingPages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="seo-guide-card">
              <div className="seo-guide-title">{page.cardTitle}</div>
              <p>{page.cardDescription}</p>
              <span>Consulter la page</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section" id="ressources">
        <div className="section-eyebrow">Sources officielles</div>
        <h2 className="section-title">Comparer NetEnPoche avec les references publiques</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Taux de cotisations sociales des micro-entrepreneurs (URSSAF)</div>
            <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/lessentiel-du-statut.html" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur urssaf.fr →</a>
          </div>
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Franchise en base de TVA : seuils et obligations pour les micro-entreprises</div>
            <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur service-public.fr →</a>
          </div>
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Versement libératoire de l'impôt sur le revenu : conditions et calcul</div>
            <a href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur impots.gouv.fr →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      <section className="final-cta">
        <h2 className="final-cta-title">Arrêtez d'estimer votre net micro-entrepreneur au hasard.</h2>
        <p className="final-cta-sub">Créez votre compte gratuit et visualisez immédiatement vos cotisations URSSAF, votre TVA et votre net après impôt.</p>
        <Link href="/auth/register" className="btn-hero-primary">Créer mon compte gratuit</Link>
        <div className="final-cta-note">
          <span>Essai gratuit sur les offres payantes</span>
          <span>Aucune carte requise pour commencer</span>
        </div>
      </section>

      {/* FOOTER */}
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
          <a href="#features" className="footer-link">Fonctionnalités</a>
          <a href="#pricing" className="footer-link">Tarifs</a>
          <a href="#faq" className="footer-link">FAQ</a>
          <Link href="/auth/login" className="footer-link">Connexion</Link>
        </div>
        <span>© 2026 NetEnPoche. Tous droits réservés.</span>
      </footer>

    </div>
  );
}




