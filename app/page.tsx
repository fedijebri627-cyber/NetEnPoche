/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './landing.css';

export const metadata: Metadata = {
  title: 'NetEnPoche — Calculateur URSSAF, TVA et Impôts pour Auto-Entrepreneurs',
  description: 'Calculez votre net en poche après URSSAF, TVA et impôts en temps réel. Gratuit pour les micro-entrepreneurs français. Alertes, bilan PDF, estimateur IR.',
  openGraph: {
    title: 'NetEnPoche — Calculateur URSSAF, TVA et Impôts pour Auto-Entrepreneurs',
    description: 'Calculez votre net en poche après URSSAF, TVA et impôts en temps réel. Gratuit pour les micro-entrepreneurs français. Alertes, bilan PDF, estimateur IR.',
    url: 'https://netenpoche.fr',
    images: [{ url: 'https://netenpoche.fr/og-image.png' }],
  },
  alternates: {
    canonical: 'https://netenpoche.fr',
  }
};

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NetEnPoche',
    operatingSystem: 'Any',
    applicationCategory: 'BusinessApplication',
    description: 'Simulateur URSSAF 2026 et calcul net auto-entrepreneur',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'EUR',
    },
  };

  return (
    <div className="landing-page">
      <Script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          NetEnPoche
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link href="/auth/login" className="nav-cta">Essai gratuit →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">🇫🇷 Pour les micro-entrepreneurs français</div>
        <h1 className="hero-title">
          Combien vous gardez<br /><span className="highlight">vraiment</span> ?
        </h1>
        <p className="hero-sub">
          NetEnPoche calcule votre net après URSSAF, TVA et impôts — en temps réel. Fini les mauvaises surprises en fin d'année. Le meilleur calculateur URSSAF auto-entrepreneur gratuit.
        </p>
        <div className="hero-actions">
          <Link href="/auth/login" className="btn-hero-primary">Calculer mon net gratuitement</Link>
          <button className="btn-hero-secondary">▶ Voir la démo · 2 min</button>
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
              <div className="preview-dot" style={{ background: '#ff5f57' }} />
              <div className="preview-dot" style={{ background: '#ffbd2e' }} />
              <div className="preview-dot" style={{ background: '#28c840' }} />
              <span style={{ marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>netenpoche.fr — Simulateur URSSAF 2026</span>
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
            <div className="proof-number">4.2M</div>
            <div className="proof-label">micro-entrepreneurs en France<br />tous concernés par l'URSSAF</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">0€</div>
            <div className="proof-label">outil gratuit fiable qui calcule<br />votre vrai net après impôts</div>
          </div>
          <div className="proof-stat">
            <div className="proof-number">SSL</div>
            <div className="proof-label">données chiffrées et sécurisées<br />jamais revendues ni partagées</div>
          </div>
        </div>
      </div>

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
              <div className="feature-item active">
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
      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>Tarifs</div>
          <h2 className="section-title">Simple. Transparent. Annulable à tout moment.</h2>
        </div>

        <div className="pricing-toggle">
          <span>Mensuel</span>
          <div className="toggle-switch" />
          <span>Annuel</span>
          <span className="annual-badge">−2 mois offerts</span>
        </div>

        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card">
            <div className="plan-name">Gratuit</div>
            <div className="plan-price">0 <span>€</span></div>
            <div className="plan-period">Pour toujours</div>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Calcul URSSAF temps réel</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Saisie mensuelle 12 mois</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Suivi plafond TVA</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Provision CFE recommandée</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Graphique mensuel</li>
              <li className="plan-feature dimmed"><span className="plan-feature-x">✗</span> Estimateur IR</li>
              <li className="plan-feature dimmed"><span className="plan-feature-x">✗</span> Alertes email</li>
              <li className="plan-feature dimmed"><span className="plan-feature-x">✗</span> Bilan PDF pro</li>
            </ul>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="plan-cta cta-free">Commencer gratuitement</button>
            </Link>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div className="featured-badge">⭐ Le plus populaire</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">5 <span>€/mois</span></div>
            <div className="plan-period">Soit 50 €/an · Annulable à tout moment</div>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Tout le plan Gratuit</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> <strong>Estimateur Impôt sur le Revenu</strong></li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Alertes email URSSAF & TVA</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Bilan PDF professionnel</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Simulateur TVA avancé</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Historique multi-années</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Objectif CA + projection</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Score de santé financière</li>
            </ul>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="plan-cta cta-pro">Essai gratuit 14 jours →</button>
            </Link>
          </div>

          {/* Expert */}
          <div className="pricing-card">
            <div className="plan-name">Expert</div>
            <div className="plan-price">14 <span>€/mois</span></div>
            <div className="plan-period">Soit 140 €/an · Annulable à tout moment</div>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Tout le plan Pro</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Gestion multi-activités</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Suivi clients & factures</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Export FEC comptable</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Export Excel avec formules</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Format Pennylane / Qonto</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Alertes factures en retard</li>
              <li className="plan-feature"><span className="plan-feature-check">✓</span> Support prioritaire</li>
            </ul>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="plan-cta cta-expert">Choisir Expert →</button>
            </Link>
          </div>
        </div>
      </section>

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

      {/* BLOG PREVIEW */}
      <section className="section" id="ressources">
        <div className="section-eyebrow">Ressources & Guides</div>
        <h2 className="section-title">Comprendre vos cotisations</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-date">2 Février 2026</div>
            <div className="blog-title">Comment calculer son URSSAF en auto-entreprise en 2026</div>
            <Link href="#" className="blog-link">Lire l'article →</Link>
          </div>
          <div className="blog-card">
            <div className="blog-date">18 Janvier 2026</div>
            <div className="blog-title">Plafond TVA 2026 : tout ce que les micro-entrepreneurs doivent savoir</div>
            <Link href="#" className="blog-link">Lire l'article →</Link>
          </div>
          <div className="blog-card">
            <div className="blog-date">5 Janvier 2026</div>
            <div className="blog-title">Versement libératoire de l'impôt : vaut-il mieux l'activer ?</div>
            <Link href="#" className="blog-link">Lire l'article →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>FAQ</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Questions fréquentes</h2>
        </div>

        <div className="faq-list">
          <div className="faq-item open">
            <div className="faq-q">
              NetEnPoche est-il officiel ou affilié à l'URSSAF ?
              <span className="faq-chevron">▾</span>
            </div>
            <div className="faq-a" style={{ display: 'block' }}>Non. NetEnPoche est un outil indépendant, créé par un entrepreneur pour les entrepreneurs. Les calculs sont basés sur les taux et barèmes officiels 2026, mais le service n'est pas affilié à l'URSSAF, à la DGFiP, ni à aucun organisme gouvernemental. Il s'agit d'un outil d'estimation, non d'un acte comptable officiel.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">
              Mes données financières sont-elles en sécurité ?
              <span className="faq-chevron">▾</span>
            </div>
            <div className="faq-a">Toutes les données sont chiffrées en transit (SSL/TLS) et au repos. Vos données ne sont jamais vendues ni partagées avec des tiers. Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis les paramètres.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">
              Puis-je annuler mon abonnement Pro à tout moment ?
              <span className="faq-chevron">▾</span>
            </div>
            <div className="faq-a">Oui, sans engagement ni frais d'annulation. Vous pouvez annuler en un clic depuis votre compte. Vous conservez l'accès Pro jusqu'à la fin de la période payée.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">
              Le calcul IR est-il fiable pour ma déclaration ?
              <span className="faq-chevron">▾</span>
            </div>
            <div className="faq-a">L'estimateur IR est un outil de simulation basé sur le barème progressif 2026. Il donne une estimation fiable pour la planification financière, mais ne remplace pas une déclaration officielle ou l'avis d'un expert-comptable pour des situations fiscales complexes (revenus mixtes, crédits d'impôt spécifiques, etc.).</div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2 className="final-cta-title">Commencez à voir votre vrai net aujourd'hui</h2>
        <p className="final-cta-sub">Gratuit. Sans carte. En 30 secondes.</p>
        <Link href="/auth/register" className="btn-hero-primary" style={{ fontSize: 17, padding: '17px 40px' }}>Calculer mon net gratuitement →</Link>
        <div className="final-cta-note">
          <span>✓ Aucune inscription requise pour l'essai</span>
          <span>✓ 14 jours Pro offerts</span>
          <span>✓ Annulable à tout moment</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link href="/" className="nav-logo" style={{ fontSize: 16 }}>
          <span className="nav-logo-dot" />
          NetEnPoche
        </Link>
        <div className="footer-links">
          <Link href="#" className="footer-link">CGU</Link>
          <Link href="#" className="footer-link">Confidentialité (RGPD)</Link>
          <Link href="#" className="footer-link">Contact</Link>
        </div>
        <span>© 2026 NetEnPoche. Tous droits réservés.</span>
      </footer>

    </div>
  );
}
