/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { FAQSection } from '@/components/landing/FAQSection';
import { faqData } from '@/components/landing/faqData';
import { PricingSection } from '@/components/landing/PricingSection';
import { getConfiguredAppUrl } from '@/lib/app-url';
import { seoLandingPages } from '@/lib/seo-pages';
import './landing.css';

const appUrl = getConfiguredAppUrl();
const homeTitle = 'Calculateur URSSAF 2026, TVA et impot micro-entrepreneur';
const homeDescription =
  'NetEnPoche est un calculateur URSSAF pour auto-entrepreneurs et micro-entrepreneurs francais. Estimez votre net apres cotisations, TVA et impot sur le revenu en temps reel.';

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
      'Calcul URSSAF en temps reel',
      'Suivi du plafond de TVA',
      "Estimateur d'impot sur le revenu",
      'Alertes echeances URSSAF',
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
          <a href="#features" className="nav-link">Fonctionnalites</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link href="/auth/register" className="nav-cta">Creer mon compte</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Calculateur URSSAF 2026 pour micro-entrepreneurs francais</div>
        <h1 className="hero-title">
          Calculateur URSSAF, TVA et impot
          <br />
          <span className="highlight">pour connaitre votre vrai net</span>
        </h1>
        <p className="hero-sub">
          NetEnPoche aide les auto-entrepreneurs a calculer leur net apres cotisations sociales,
          TVA et impot sur le revenu. Suivez votre chiffre d'affaires, anticipez vos echeances
          et evitez les mauvaises surprises de fin d'annee.
        </p>
        <div className="hero-actions">
          <Link href="/auth/register" className="btn-hero-primary">Essayer gratuitement</Link>
          <a href="#pricing" className="btn-hero-secondary">Comparer les offres</a>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Gratuit pour toujours</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Aucune carte requise</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Donnees chiffrees SSL</div>
          <div className="hero-trust-item"><span className="hero-trust-dot">+</span> Non affilie a l'URSSAF</div>
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
                <span className="ml-1 text-xs text-white/30">netenpoche.fr - Tableau de bord 2026</span>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-kpi">
                <div className="preview-kpi-label">URSSAF a payer</div>
                <div className="preview-kpi-value" style={{ color: '#e84040' }}>7 092 EUR</div>
                <div className="preview-kpi-trend" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Sur l'annee</div>
              </div>
              <div className="preview-kpi">
                <div className="preview-kpi-label">Net en poche</div>
                <div className="preview-kpi-value" style={{ color: '#00c875' }}>26 520 EUR</div>
                <div className="preview-kpi-trend" style={{ color: '#00c875', fontSize: 11 }}>Hausse YTD</div>
              </div>
              <div className="preview-kpi">
                <div className="preview-kpi-label">Projection annuelle</div>
                <div className="preview-kpi-value" style={{ color: '#a5b4fc' }}>~63 500 EUR</div>
                <div className="preview-kpi-trend" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>A ce rythme</div>
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
                  <div className="bar-label">Fev</div>
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
                  <div className="bar-label" style={{ color: '#f5a623' }}>Mai alerte</div>
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

      <div className="proof-section">
        <div className="proof-inner">
          <div className="proof-stat">
            <div className="proof-number">4,2 M</div>
            <div className="proof-label">micro-entrepreneurs en France<br />concernes par l'URSSAF et la TVA</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">0 EUR</div>
            <div className="proof-label">pour commencer a calculer<br />votre vrai net apres charges</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">2026</div>
            <div className="proof-label">regles et projections fiscales<br />pour mieux piloter votre activite</div>
          </div>
        </div>
      </div>

      <section className="section intent-section" id="intent">
        <div className="section-eyebrow">Ce que calcule NetEnPoche</div>
        <h2 className="section-title">Les vraies questions d'un auto-entrepreneur, traitees au meme endroit</h2>
        <p className="section-sub">
          Le site repond aux recherches les plus frequentes autour de l'URSSAF, de la TVA
          et du net micro-entrepreneur, sans vous obliger a jongler entre plusieurs simulateurs.
        </p>

        <div className="intent-grid">
          <div className="intent-card">
            <div className="intent-title">Calculer votre net apres URSSAF</div>
            <div className="intent-text">Visualisez immediatement les cotisations sociales et ce qu'il vous reste vraiment apres prelevements.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Anticiper le plafond de TVA</div>
            <div className="intent-text">Suivez la franchise en base de TVA et reperez le bon moment pour ajuster vos factures.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Estimer l'impot sur le revenu</div>
            <div className="intent-text">Projetez votre net apres impot selon votre situation fiscale, vos parts et votre activite.</div>
          </div>
          <div className="intent-card">
            <div className="intent-title">Piloter votre activite freelance</div>
            <div className="intent-text">Alertes, bilan PDF, suivi clients et factures pour passer du simple calcul a une vraie vision financiere.</div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-eyebrow">Comment ca marche</div>
        <h2 className="section-title">En 3 etapes simples</h2>
        <p className="section-sub">Un outil de calcul net auto-entrepreneur concu pour vous simplifier la vie, pas l'inverse.</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-title">Saisissez votre CA</div>
            <div className="step-text">Entrez simplement votre chiffre d'affaires mensuel. Pas de jargon comptable, pas de tableur complique.</div>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-title">On calcule tout</div>
            <div className="step-text">Cotisations sociales, plafond TVA micro-entreprise et impot sur le revenu 2026 s'actualisent instantanement.</div>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-title">Vous gardez le controle</div>
            <div className="step-text">Alertes par email, reserve conseillee, suivi TVA et bilan PDF pour eviter les mauvaises surprises.</div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-eyebrow">Le probleme</div>
        <h2 className="section-title">La question que tout freelance se pose<br />sans jamais trouver la reponse exacte</h2>
        <p className="section-sub">Les outils existent. Mais aucun ne vous dit simplement combien il vous reste apres avoir tout paye.</p>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-emoji">IR</div>
            <div className="problem-title">La surprise de fin d'annee</div>
            <div className="problem-text">Vous avez bien gagne votre vie, puis l'impot arrive et le chiffre ne ressemble plus a ce que vous pensiez garder.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">TVA</div>
            <div className="problem-title">Le plafond TVA invisible</div>
            <div className="problem-text">Vous etes en franchise de TVA, puis vous depassez un seuil et la lecture de votre revenu change brutalement.</div>
          </div>
          <div className="problem-card">
            <div className="problem-emoji">CA</div>
            <div className="problem-title">Excel ne suffit plus</div>
            <div className="problem-text">Le tableur suit le CA, mais pas toujours le foyer fiscal, la reserve, l'impot et l'impact reel sur votre net.</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <div className="section-eyebrow">La solution</div>
          <h2 className="section-title">Tout ce dont un micro-entrepreneur<br />a besoin, au meme endroit</h2>

          <div className="features-grid">
            <div className="feature-list">
              <div className="feature-item" style={{ cursor: 'default' }}>
                <div className="feature-icon">CA</div>
                <div>
                  <div className="feature-text-title">Calcul URSSAF en temps reel <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Saisissez votre CA mois par mois. URSSAF, net en poche et provision CFE se calculent instantanement.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">TVA</div>
                <div>
                  <div className="feature-text-title">Suivi plafond TVA <span className="feature-badge badge-free">Gratuit</span></div>
                  <div className="feature-text-desc">Une barre de progression visuelle qui vire a l'orange puis au rouge quand il faut agir.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">IR</div>
                <div>
                  <div className="feature-text-title">Estimateur impot sur le revenu <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Le vrai net apres IR selon votre foyer fiscal, vos parts et votre tranche marginale.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">CAL</div>
                <div>
                  <div className="feature-text-title">Calendrier URSSAF et alertes email <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Dates d'echeance, montants par trimestre et rappels automatiques avant chaque paiement.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">PDF</div>
                <div>
                  <div className="feature-text-title">Bilan PDF professionnel <span className="feature-badge badge-pro">Pro</span></div>
                  <div className="feature-text-desc">Un document pret pour votre banque, votre bailleur ou votre comptable.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">CRM</div>
                <div>
                  <div className="feature-text-title">Suivi clients et factures <span className="feature-badge badge-expert">Expert</span></div>
                  <div className="feature-text-desc">Enregistrez vos clients, facturez, relancez et reliez le tout a votre chiffre d'affaires.</div>
                </div>
              </div>
            </div>

            <div className="feature-visual">
              <div className="fv-title">Votre vrai net apres impot</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                Base sur votre CA 2026 - Celibataire - 1 part
              </div>

              <div className="waterfall">
                <div className="wf-row">
                  <div className="wf-label">CA annuel brut</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '100%', background: 'rgba(255,255,255,0.15)' }} /></div>
                  <div className="wf-value">33 613 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- URSSAF (21.1%)</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '21%', background: '#e84040' }} /></div>
                  <div className="wf-value" style={{ color: '#e84040' }}>- 7 092 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- Abattement (34%)</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '34%', background: 'rgba(245,166,35,0.6)' }} /></div>
                  <div className="wf-value" style={{ color: 'rgba(245,166,35,0.8)' }}>- 11 428 EUR</div>
                </div>
                <div className="wf-row">
                  <div className="wf-label">- Impot sur le revenu</div>
                  <div className="wf-bar-track"><div className="wf-bar-fill" style={{ width: '8%', background: '#f59e0b' }} /></div>
                  <div className="wf-value" style={{ color: '#f59e0b' }}>- 1 647 EUR</div>
                </div>
              </div>

              <div className="wf-final">
                <div>
                  <div className="wf-final-label">NET REEL EN POCHE</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,200,117,0.6)', marginTop: 2 }}>Apres URSSAF + IR - 2026</div>
                </div>
                <div className="wf-final-value">24 874 EUR</div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 11, color: 'rgba(165,180,252,0.8)', marginBottom: 4 }}>Comparaison versement liberatoire</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Avec VL :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#a5b4fc' }}>25 213 EUR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sans VL :</span>
                  <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, color: '#00c875' }}>24 874 EUR</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 6 }}>Le versement liberatoire vous economise 339 EUR/an</div>
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
                <th>Fonctionnalite</th>
                <th className="comp-me">NetEnPoche Pro</th>
                <th>Fichier Excel</th>
                <th>Outil Comptable (Indy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prix</td>
                <td className="comp-me">5 EUR / mois</td>
                <td>Gratuit (ou temps personnel)</td>
                <td>~24 EUR / mois</td>
              </tr>
              <tr>
                <td>Calcul IR et foyer fiscal</td>
                <td className="comp-me">Exclusivite integree</td>
                <td>Rarement fonctionnel</td>
                <td>Non, oriente entreprise</td>
              </tr>
              <tr>
                <td>Simplicite d'utilisation</td>
                <td className="comp-me">Aucun jargon</td>
                <td>Complexe a parametrer</td>
                <td>Lourd et connecte aux banques</td>
              </tr>
              <tr>
                <td>Alertes automatiques</td>
                <td className="comp-me">Emails URSSAF et TVA</td>
                <td>Aucune alerte</td>
                <td>Rappels generaux</td>
              </tr>
              <tr>
                <td>Bilan financier PDF</td>
                <td className="comp-me">En 1 clic</td>
                <td>Non supporte</td>
                <td>Formats comptables complexes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PricingSection />

      <section className="testimonials">
        <div style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>Temoignages</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Ce que disent les freelances
            <br />
            qui l'utilisent
          </h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">5/5</div>
            <div className="testimonial-text">"Enfin un outil qui me dit combien je garde vraiment apres les impots. J'ai evite une mauvaise surprise de 2 300 EUR grace a la projection annuelle."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">ML</div>
              <div>
                <div className="testimonial-name">Marie L.</div>
                <div className="testimonial-role">Consultante RH - Paris</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">5/5</div>
            <div className="testimonial-text">"L'alerte TVA m'a sauve la mise. J'etais a 92% du plafond et je ne m'en etais pas rendu compte."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">TK</div>
              <div>
                <div className="testimonial-name">Thomas K.</div>
                <div className="testimonial-role">Dev freelance - Lyon</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">4/5</div>
            <div className="testimonial-text">"Le bilan PDF m'a permis d'obtenir mon appartement sans garant. La banque et le bailleur ont accepte le document sans demander d'autres justificatifs."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">SA</div>
              <div>
                <div className="testimonial-name">Sofia A.</div>
                <div className="testimonial-role">Graphiste - Bordeaux</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="guides">
        <div className="section-eyebrow">Guides cibles</div>
        <h2 className="section-title">Des pages dediees aux requetes SEO que vous pouvez vraiment gagner</h2>
        <p className="section-sub">
          Au lieu de viser seulement la requete institutionnelle "calcul URSSAF", NetEnPoche
          cree aussi des points d'entree plus precis pour les micro-entrepreneurs qui cherchent
          un resultat exploitable.
        </p>
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

      <section className="section" id="ressources">
        <div className="section-eyebrow">Sources officielles</div>
        <h2 className="section-title">Comparer NetEnPoche avec les references publiques</h2>
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
            <div className="blog-title">Versement liberatoire de l'impot sur le revenu : conditions et calcul</div>
            <a href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire" target="_blank" rel="noopener noreferrer" className="blog-link">Lire sur impots.gouv.fr -&gt;</a>
          </div>
        </div>
      </section>

      <FAQSection />

      <section className="final-cta">
        <h2 className="final-cta-title">Arretez d'estimer votre net micro-entrepreneur au hasard.</h2>
        <p className="final-cta-sub">Creez votre compte gratuit et visualisez immediatement vos cotisations URSSAF, votre TVA et votre net apres impot.</p>
        <Link href="/auth/register" className="btn-hero-primary">Creer mon compte gratuit</Link>
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
          <a href="#features" className="footer-link">Fonctionnalites</a>
          <a href="#pricing" className="footer-link">Tarifs</a>
          <a href="#faq" className="footer-link">FAQ</a>
          <Link href="/auth/login" className="footer-link">Connexion</Link>
        </div>
        <span>Copyright 2026 NetEnPoche. Tous droits reserves.</span>
      </footer>
    </div>
  );
}
