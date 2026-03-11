'use client';

import { useMemo, useState } from 'react';
import {
  calculateCompositeNetBreakdown,
  formatCurrency,
  getCompositeTvaStatus,
  type InsightConfig,
} from '@/lib/dashboard-insights';

type LandingActivity = InsightConfig['activity_type'];

const calculatorActivities: Array<{
  value: LandingActivity;
  label: string;
  shortLabel: string;
}> = [
  { value: 'services_bnc', label: 'Prestations de services (BNC)', shortLabel: 'BNC' },
  { value: 'services_bic', label: 'Prestations de services (BIC)', shortLabel: 'BIC' },
  { value: 'liberal', label: 'Profession libérale', shortLabel: 'Libérale' },
  { value: 'vente', label: 'Achat / revente', shortLabel: 'Vente' },
];

function buildLandingConfig(activityType: LandingActivity): InsightConfig {
  return {
    year: 2026,
    activity_type: activityType,
    secondary_activity_type: null,
    secondary_activity_share: null,
    acre_enabled: false,
    versement_liberatoire: false,
    annual_ca_goal: null,
    situation_familiale: 'celibataire',
    parts_fiscales: 1,
    autres_revenus: 0,
  };
}

export function HeroCalculator() {
  const [monthlyCA, setMonthlyCA] = useState(3200);
  const [activityType, setActivityType] = useState<LandingActivity>('services_bnc');

  const config = useMemo(() => buildLandingConfig(activityType), [activityType]);
  const annualCA = monthlyCA * 12;

  const breakdown = useMemo(
    () => calculateCompositeNetBreakdown(annualCA, config),
    [annualCA, config]
  );

  const reserve = breakdown.urssaf + breakdown.ir + breakdown.cfe;
  const tva = useMemo(() => getCompositeTvaStatus(annualCA, config), [annualCA, config]);

  const tvaProgress = Math.min(100, tva.percentage);
  const tvaTone =
    tva.status === 'danger' ? 'var(--red)' : tva.status === 'warning' ? 'var(--amber)' : 'var(--green)';

  return (
    <div className="hero-calculator-shell">
      <div className="hero-calculator-inputs">
        <div className="hero-calculator-kicker">Testez le calcul en direct</div>
        <h3 className="hero-calculator-title">Entrez votre CA mensuel et voyez votre vrai net immédiatement</h3>
        <p className="hero-calculator-copy">
          Même moteur de calcul que dans l’application : URSSAF, impôt, CFE et lecture TVA.
        </p>

        <label className="hero-calculator-label" htmlFor="landing-ca-input">
          Chiffre d’affaires mensuel
        </label>
        <div className="hero-calculator-input-wrap">
          <input
            id="landing-ca-input"
            type="number"
            min={0}
            step={100}
            value={monthlyCA}
            onChange={(event) => setMonthlyCA(Math.max(0, Number(event.target.value || 0)))}
            className="hero-calculator-input"
          />
          <span>EUR / mois</span>
        </div>

        <div className="hero-calculator-label">Type d’activité</div>
        <div className="hero-calculator-activity-grid">
          {calculatorActivities.map((activity) => (
            <button
              key={activity.value}
              type="button"
              className={`hero-calculator-chip ${activityType === activity.value ? 'is-active' : ''}`}
              onClick={() => setActivityType(activity.value)}
            >
              <strong>{activity.shortLabel}</strong>
              <span>{activity.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hero-calculator-output">
        <div className="hero-calculator-mode">Simulation 2026 • Célibataire • 1 part</div>

        <div className="hero-calculator-kpis">
          <div className="hero-calculator-card">
            <div className="hero-calculator-card-label">Net estimé</div>
            <div className="hero-calculator-card-value is-green">{formatCurrency(breakdown.netReel)}</div>
            <div className="hero-calculator-card-hint">sur 12 mois</div>
          </div>
          <div className="hero-calculator-card">
            <div className="hero-calculator-card-label">URSSAF à payer</div>
            <div className="hero-calculator-card-value is-red">{formatCurrency(breakdown.urssaf)}</div>
            <div className="hero-calculator-card-hint">cotisations sociales</div>
          </div>
          <div className="hero-calculator-card">
            <div className="hero-calculator-card-label">Réserve conseillée</div>
            <div className="hero-calculator-card-value is-indigo">{formatCurrency(reserve)}</div>
            <div className="hero-calculator-card-hint">URSSAF + IR + CFE</div>
          </div>
        </div>

        <div className="hero-calculator-bottom">
          <div className="hero-calculator-tva">
            <div className="hero-calculator-card-label">Progression TVA</div>
            <div className="hero-calculator-tva-row">
              <span>{tva.percentage.toFixed(0)}%</span>
              <span>Seuil {formatCurrency(tva.threshold)}</span>
            </div>
            <div className="hero-calculator-tva-track">
              <div
                className="hero-calculator-tva-fill"
                style={{ width: `${tvaProgress}%`, background: tvaTone }}
              />
            </div>
            <div className="hero-calculator-card-hint">
              {tva.remaining > 0
                ? `Il vous reste ${formatCurrency(tva.remaining)} avant le seuil.`
                : 'Le seuil de franchise en base est dépassé.'}
            </div>
          </div>

          <div className="hero-calculator-summary">
            <div className="hero-calculator-summary-row">
              <span>CA annuel simulé</span>
              <strong>{formatCurrency(annualCA)}</strong>
            </div>
            <div className="hero-calculator-summary-row">
              <span>Impôt estimé</span>
              <strong>{formatCurrency(breakdown.ir)}</strong>
            </div>
            <div className="hero-calculator-summary-row">
              <span>Provision CFE</span>
              <strong>{formatCurrency(breakdown.cfe)}</strong>
            </div>
            <div className="hero-calculator-summary-row is-strong">
              <span>Taux global</span>
              <strong>{(breakdown.tauxGlobal * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

