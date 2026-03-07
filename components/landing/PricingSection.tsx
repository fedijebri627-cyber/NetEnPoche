'use client';

import { useState } from 'react';
import Link from 'next/link';

export function PricingSection() {
    const [annual, setAnnual] = useState(false);

    return (
        <section className="pricing-section" id="pricing">
            <div style={{ textAlign: 'center' }}>
                <div className="section-eyebrow" style={{ textAlign: 'center' }}>Tarifs</div>
                <h2 className="section-title">Simple. Transparent. Annulable à tout moment.</h2>
            </div>

            <div className="pricing-toggle">
                <span
                    style={{ cursor: 'pointer', color: !annual ? 'white' : undefined, fontWeight: !annual ? 700 : undefined }}
                    onClick={() => setAnnual(false)}
                >
                    Mensuel
                </span>
                <div
                    className="toggle-switch"
                    onClick={() => setAnnual(!annual)}
                    style={{ cursor: 'pointer' }}
                >
                    <span style={{
                        position: 'absolute',
                        width: 20, height: 20,
                        background: 'white', borderRadius: '50%',
                        top: 3,
                        left: annual ? 23 : 3,
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }} />
                </div>
                <span
                    style={{ cursor: 'pointer', color: annual ? 'white' : undefined, fontWeight: annual ? 700 : undefined }}
                    onClick={() => setAnnual(true)}
                >
                    Annuel
                </span>
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
                    <div className="plan-price">
                        {annual ? '50' : '5'} <span>€{annual ? '/an' : '/mois'}</span>
                    </div>
                    <div className="plan-period">
                        {annual ? 'Soit 4,17 €/mois · Économisez 10 €' : 'Soit 50 €/an · Annulable à tout moment'}
                    </div>
                    <div className="plan-divider" />
                    <ul className="plan-features">
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> Tout le plan Gratuit</li>
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> <strong>Estimateur Impôt sur le Revenu</strong></li>
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> Alertes email URSSAF &amp; TVA</li>
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
                    <div className="plan-price">
                        {annual ? '140' : '14'} <span>€{annual ? '/an' : '/mois'}</span>
                    </div>
                    <div className="plan-period">
                        {annual ? 'Soit 11,67 €/mois · Économisez 28 €' : 'Soit 140 €/an · Annulable à tout moment'}
                    </div>
                    <div className="plan-divider" />
                    <ul className="plan-features">
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> Tout le plan Pro</li>
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> Gestion multi-activités</li>
                        <li className="plan-feature"><span className="plan-feature-check">✓</span> Suivi clients &amp; factures</li>
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
    );
}
