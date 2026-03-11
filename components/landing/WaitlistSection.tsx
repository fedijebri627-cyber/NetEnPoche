'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<WaitlistState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Impossible de vous inscrire pour le moment.');
      }

      setStatus('success');
      setMessage('Vous êtes bien inscrit. Nous vous écrirons dès qu’une nouveauté importante sera prête.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Impossible de vous inscrire pour le moment.');
    }
  }

  return (
    <section className="waitlist-section" id="waitlist">
      <div className="section-eyebrow" style={{ textAlign: 'center' }}>Crédibilité avant tout</div>
      <h2 className="section-title" style={{ textAlign: 'center' }}>
        Pas de faux témoignages. Préférez une liste prioritaire utile.
      </h2>
      <p className="section-sub waitlist-subtitle">
        NetEnPoche grandit encore. Au lieu d’afficher des avis inventés, nous préférons vous proposer une liste
        prioritaire pour recevoir les nouveautés produit, les nouveaux guides et les prochaines améliorations.
      </p>

      <div className="waitlist-grid">
        <div className="waitlist-card founder-card">
          <div className="founder-chip">Mot du fondateur</div>
          <p className="founder-note">
            NetEnPoche a été construit par un indépendant pour les indépendants qui veulent enfin voir,
            sans tableur ni jargon, ce qu’il leur reste vraiment après URSSAF, TVA et impôt.
          </p>
          <div className="founder-actions">
            <Link href="/auth/register" className="btn-hero-primary">
              Créer mon compte gratuit
            </Link>
            <Link href="/contact" className="btn-hero-secondary founder-secondary">
              Nous contacter
            </Link>
          </div>
        </div>

        <form className="waitlist-card waitlist-form-card" onSubmit={(event) => void handleSubmit(event)}>
          <div className="waitlist-form-title">Recevoir les prochaines nouveautés</div>
          <p className="waitlist-form-copy">
            Une mise à jour quand un nouveau guide, une nouvelle fonction ou une ouverture bêta vaut vraiment le détour.
          </p>

          <label htmlFor="waitlist-email" className="waitlist-label">Votre e-mail</label>
          <div className="waitlist-form-row">
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="waitlist-input"
            />
            <button type="submit" className="btn-hero-primary waitlist-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Envoi...' : 'Rejoindre la liste'}
            </button>
          </div>

          <div className={`waitlist-message is-${status}`}>{message || 'Aucune carte, aucun spam, seulement les mises à jour utiles.'}</div>
        </form>
      </div>
    </section>
  );
}

