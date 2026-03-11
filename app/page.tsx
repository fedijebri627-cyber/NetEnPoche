/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { FAQSection } from '@/components/landing/FAQSection';
import { faqData } from '@/components/landing/faqData';
import { HeroCalculator } from '@/components/landing/HeroCalculator';
import { PricingSection } from '@/components/landing/PricingSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { getConfiguredAppUrl } from '@/lib/app-url';
import { NETENPOCHE_CONTACT_EMAIL } from '@/lib/contact';
import { getLandingStats } from '@/lib/landing-stats';
import { seoLandingPages } from '@/lib/seo-pages';
import './landing.css';

const appUrl = getConfiguredAppUrl();
const homeTitle = 'Calculateur URSSAF 2026, TVA et impôt micro-entrepreneur';
const homeDescription =
  'NetEnPoche est un calculateur URSSAF pour auto-entrepreneurs et micro-entrepreneurs français. Estimez votre net après cotisations, TVA et impôt sur le revenu en temps réel.';

const guideDescriptions: Record<string, string> = {
  'calcul-urssaf': 'Comprendre vos cotisations, votre TVA et ce qu’il vous reste réellement une fois tout payé.',
  'calcul-urssaf-auto-entrepreneur': 'Voir rapidement l’impact de votre activité sur vos charges et votre revenu disponible.',
  'calcul-net-auto-entrepreneur': 'Passer du chiffre d’affaires au vrai net sans vous perdre dans plusieurs simulateurs.',
  'tva-micro-entreprise': 'Comprendre quand la TVA change vraiment votre prix, vos factures et votre trésorerie.',
  'plafond-tva-auto-entrepreneur': 'Anticiper le moment où le seuil TVA approche et préparer la suite sans surprise.',
  'versement-liberatoire-auto-entrepreneur': 'Comparer votre situation avec ou sans versement libératoire avant de choisir.',
};

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

export default async function LandingPage() {
  const stats = await getLandingStats();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NetEnPoche',
    url: appUrl,
    logo: `${appUrl}/brand/netenpoche-icon-1024.png`,
    description: homeDescription,
    areaServed: 'FR',
    contactPoint: {
      '@type': 'ContactPoint',
      email: NETENPOCHE_CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['French'],
    },
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
  const monthlyEntriesCount = stats.monthlyEntriesCount;
  const monthlyEntriesLabel = monthlyEntriesCount && monthlyEntriesCount > 0
    ? new Intl.NumberFormat('fr-FR').format(monthlyEntriesCount)
    : '5 min';
  const monthlyEntriesCopy = monthlyEntriesCount && monthlyEntriesCount > 0
    ? 'saisies réelles de chiffre d’affaires déjà enregistrées dans NetEnPoche'
    : 'pour connaître votre vrai net sans jargon ni tableur';

  return (
    <div className="landing-page">
      <Script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
          <a href="#features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="#guides" className="nav-link">Guides</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link href="/auth/register" className="nav-cta">Créer mon compte</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Calculateur URSSAF 2026 pour micro-entrepreneurs français</div>
        <h1 className="hero-title">
          Calculateur URSSAF, TVA et impôt
          <br />
          <span className="highlight">pour connaître votre vrai net</span>
        </h1>
        <p className="hero-sub">
          NetEnPoche aide les auto-entrepreneurs à calculer leur net après cotisations sociales,
          TVA et impôt sur le revenu. Suivez votre chiffre d'affaires, anticipez vos échéances
          et évitez les mauvaises surprises de fin d'année.
        </p>
        <div className="hero-actions">
          <Link href="/auth/register" className="btn-hero-primary">Essayer gratuitement</Link>
          <a href="#pricing" className="btn-hero-secondary">Comparer les offres</a>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Gratuit pour toujours</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Aucune carte requise</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Données chiffrées SSL</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Non affilié à l'URSSAF</div>
        </div>

        <div className="hero-preview">
          <div className="preview-glow"></div>
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="flex gap-1.5 px-4">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                <Image
                  src="/brand/netenpoche-favicon-32.png"
                  alt=""
                  width={16}
                  height={16}
                  className="ml-2 rounded-sm opacity-70"
                />
                <span className="ml-1 text-xs text-white/30">netenpoche.fr • Démo calculatrice 2026</span>
              </div>
            </div>
            <HeroCalculator />
          </div>
        </div>
      </section>

      <div className="proof-section">
        <div className="proof-inner">
          <div className="proof-stat">
            <div className="proof-number">4,2 M</div>
            <div className="proof-label">micro-entrepreneurs en France<br />concernés par l'URSSAF et la TVA</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">{monthlyEntriesLabel}</div>
            <div className="proof-label">{monthlyEntriesCopy}</div>
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
        <p className="section-sub">
          Le site répond aux recherches les plus fréquentes autour de l'URSSAF, de la TVA
          et du net micro-entrepreneur, sans vous obliger à jongler entre plusieurs simulateurs.
        </p>

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
            <div className="step-text">Cotisations sociales, plafond TVA micro-entreprise et impôt sur le revenu 2026 s'actualisent instantanément.</div>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-title">Vous gardez le contrôle</div>
            <div className="step-text">Alertes par e-mail, réserve conseillée, suivi TVA et bilan PDF pour éviter les mauvaises surprises.</div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-eyebrow">Le problème</div>
        <h2 className="section-title">La question que tout freelance se pose<br />sans jamais trouver la réponse exacte</h2>
        <p className="section-sub">Les outils existent. Mais aucun ne vous dit simplement combien il vous reste après avoir tout payé.</p>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-emoji">IR</div>
            <div className="problem-title">La surprise de fin d'année</div>
            <div className="problem-text">Vous avez bien gagné votre vie, puis l'impôt arrive et le chiffre ne ressemble plus à ce que vous pensiez garder.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">TVA</div>
            <div className="problem-title">Le plafond TVA invisible</div>
            <div className="problem-text">Vous êtes en franchise de TVA, puis vous dépassez un seuil et la lecture de votre revenu change brutalement.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">CA</div>
            <div className="problem-title">Excel ne suffit plus</div>
            <div className="problem-text">Le tableur suit le CA, mais pas toujours le foyer fiscal, la réserve, l'impôt et l'impact réel sur votre net.</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <div className="section-eyebrow">La solution</div>
          <h2 className="section-title">Tout ce dont un micro-entrepreneur<br />a besoin, au même endroit</h2>

          <div className="features-grid">
            <div className="feature-list">
              <div className="feature-item" style={{ cursor: 'default' }}>
                <div className="feature-icon">CA</div>
                <div>
                  <div className="feature-text-title">Calcul URSSAF en temps réel <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Saisissez votre CA mois par mois. URSSAF, net en poche et provision CFE se calculent instantanément.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">TVA</div>
                <div>
                  <div className="feature-text-title">Suivi plafond TVA <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Une barre de progression visuelle qui vire à l'orange puis au rouge quand il faut agir.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">IR</div>
                <div>
                  <div className="feature-text-title">Estimateur impôt sur le revenu <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Le vrai net après IR selon votre foyer fiscal, vos parts et votre tranche marginale.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">CAL</div>
                <div>
                  <div className="feature-text-title">Calendrier URSSAF et alertes e-mail <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Dates d'échéance, montants par trimestre et rappels automatiques avant chaque paiement.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">PDF</div>
                <div>
                  <div className="feature-text-title">Bilan PDF professionnel <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Un document prêt pour votre banque, votre bailleur ou votre comptable.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">CRM</div>
                <div>
                  <div className="feature-text-title">Suivi clients et factures <span className="feature-badge badge-expert">Expert</span></div>
                  <div className="feature-text-desc">Enregistrez vos clients, facturez, relancez et reliez le tout à votre chiffre d'affaires.</div>
                </div>
              </div>
            </div>

            <div className="feature-visual">
              <div className="fv-title">Votre vrai net après impôt</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
                Vision annuelle 2026 • Célibataire • 1 part
              </div>

              <div className="waterfall">
                <div className="wf-row">
                  <div className="wf-label">CA annuel brut</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '100%', background: 'rgba(255,255,255,0.15)' }} /></div>
                  <div className="wf-value">33 600 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- URSSAF</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '21%', background: '#e84040' }} /></div>
                  <div className="wf-value" style={{ color: '#e84040' }}>- 7 090 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- Impôt</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '6%', background: '#f59e0b' }} /></div>
                  <div className="wf-value" style={{ color: '#f59e0b' }}>- 2 180 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- Provision CFE</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '4%', background: 'rgba(245,166,35,0.6)' }} /></div>
                  <div className="wf-value" style={{ color: 'rgba(245,166,35,0.8)' }}>- 1 380 EUR</div>
                </div>
              </div>

              <div className="wf-final">
                <div>
                  <div className="wf-final-label">NET RÉEL EN POCHE</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,200,117,0.6)', marginTop: 2 }}>Après URSSAF + IR + CFE</div>
                </div>
                <div className="wf-final-value">22 950 EUR</div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 11, color: 'rgba(165,180,252,0.8)', marginBottom: 4 }}>Ce qui vous différencie d’un calculateur classique</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Réserve recommandée :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#a5b4fc' }}>10 650 EUR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Alerte TVA :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#00c875' }}>visible avant le dépassement</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 6 }}>Le but n'est pas seulement de calculer. Le but est de piloter.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <th>Outil comptable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prix</td>
                <td className="comp-me">5 EUR / mois</td>
                <td>Gratuit (ou temps personnel)</td>
                <td>Souvent plus cher et plus lourd</td>
              </tr>
              <tr>
                <td>Calcul IR et foyer fiscal</td>
                <td className="comp-me">Intégré au même écran</td>
                <td>Rarement fonctionnel</td>
                <td>Souvent orienté tenue comptable</td>
              </tr>
              <tr>
                <td>Simplicité d'utilisation</td>
                <td className="comp-me">Aucun jargon</td>
                <td>Complexe à paramétrer</td>
                <td>Peut être surdimensionné</td>
              </tr>
              <tr>
                <td>Alertes automatiques</td>
                <td className="comp-me">URSSAF, TVA et rythme annuel</td>
                <td>Aucune alerte</td>
                <td>Souvent généraliste</td>
              </tr>
              <tr>
                <td>Bilan financier PDF</td>
                <td className="comp-me">En 1 clic</td>
                <td>Non supporté</td>
                <td>Formats peu lisibles pour un bailleur</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PricingSection />

      <WaitlistSection />

      <section className="section" id="guides">
        <div className="section-eyebrow">Guides pratiques</div>
        <h2 className="section-title">Ressources utiles pour auto-entrepreneurs</h2>
        <p className="section-sub">
          Des guides clairs pour comprendre la TVA, l'impôt, le vrai net et les choix fiscaux sans devoir traduire une documentation administrative.
        </p>
        <div className="seo-guides-grid">
          {seoLandingPages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="seo-guide-card">
              <div className="seo-guide-title">{page.cardTitle}</div>
              <p>{guideDescriptions[page.slug] || page.cardDescription}</p>
              <span>Consulter le guide</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="ressources">
        <div className="section-eyebrow">Sources officielles</div>
        <h2 className="section-title">Comparer NetEnPoche avec les références publiques</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Taux de cotisations sociales des micro-entrepreneurs (URSSAF)</div>
            <a href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/lessentiel-du-statut.html" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur urssaf.fr -&gt;</a>
          </div>
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Franchise en base de TVA : seuils et obligations pour les micro-entreprises</div>
            <a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur service-public.fr -&gt;</a>
          </div>
          <div className="blog-card">
            <div className="blog-date">Guide officiel</div>
            <div className="blog-title">Versement libératoire de l'impôt sur le revenu : conditions et calcul</div>
            <a href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur impots.gouv.fr -&gt;</a>
          </div>
        </div>
      </section>

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

