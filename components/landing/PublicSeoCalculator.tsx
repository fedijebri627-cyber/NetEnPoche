'use client';

import { useMemo, useState } from 'react';
import type { ActivityType } from '@/lib/calculations';
import {
  calculateBreakEvenCaForSalary,
  calculateEquivalentSalaryForFreelanceNet,
  calculateFreelanceSnapshot,
  calculateSalariedNet,
  findMonthlyCaForTargetNet,
  type PublicFamilyStatus,
} from '@/lib/public-calculators';

type CalculatorVariant = 'brut-net' | 'freelance-vs-salarie' | 'tjm';

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('fr-FR');

const activityOptions: Array<{ value: ActivityType; label: string }> = [
  { value: 'services_bic', label: 'Services BIC' },
  { value: 'services_bnc', label: 'Services BNC' },
  { value: 'vente', label: 'Vente' },
  { value: 'liberal', label: 'Libéral' },
];

const familyOptions: Array<{ value: PublicFamilyStatus; label: string }> = [
  { value: 'celibataire', label: 'Célibataire' },
  { value: 'marie', label: 'Marié(e)' },
];

function formatCurrency(value: number) {
  return euroFormatter.format(Math.max(0, value));
}

function formatPercent(value: number) {
  return `${value.toFixed(1)} %`;
}

function describeTvaStatus(percentage: number) {
  const rounded = Math.round(percentage);

  if (percentage >= 100) {
    return `Seuil depasse - TVA obligatoire (${rounded} %)`;
  }

  if (percentage >= 85) {
    return `Alerte TVA (${rounded} % du seuil)`;
  }

  return `${rounded} % du seuil`;
}

function BarComparison({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
}) {
  const max = Math.max(leftValue, rightValue, 1);

  return (
    <div className="seo-tool-bars">
      <div className="seo-tool-bar-row">
        <div className="seo-tool-bar-copy">
          <span>{leftLabel}</span>
          <strong>{formatCurrency(leftValue)}</strong>
        </div>
        <div className="seo-tool-bar-track">
          <div className="seo-tool-bar-fill is-green" style={{ width: `${(leftValue / max) * 100}%` }} />
        </div>
      </div>
      <div className="seo-tool-bar-row">
        <div className="seo-tool-bar-copy">
          <span>{rightLabel}</span>
          <strong>{formatCurrency(rightValue)}</strong>
        </div>
        <div className="seo-tool-bar-track">
          <div className="seo-tool-bar-fill is-navy" style={{ width: `${(rightValue / max) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function ActivityButtons({ value, onChange }: { value: ActivityType; onChange: (next: ActivityType) => void }) {
  return (
    <div className="seo-tool-chip-grid">
      {activityOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`seo-tool-chip ${value === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FamilyButtons({ value, onChange }: { value: PublicFamilyStatus; onChange: (next: PublicFamilyStatus) => void }) {
  return (
    <div className="seo-tool-chip-grid is-compact">
      {familyOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`seo-tool-chip ${value === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ToggleField({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button type="button" className={`seo-tool-toggle ${checked ? 'is-active' : ''}`} onClick={() => onChange(!checked)}>
      <span className="seo-tool-toggle-knob" />
      <span>{label}</span>
    </button>
  );
}

function BrutNetCalculator() {
  const [monthlyCA, setMonthlyCA] = useState(3200);
  const [activityType, setActivityType] = useState<ActivityType>('services_bnc');
  const [familyStatus, setFamilyStatus] = useState<PublicFamilyStatus>('celibataire');
  const [versementLiberatoire, setVersementLiberatoire] = useState(false);

  const snapshot = useMemo(
    () => calculateFreelanceSnapshot({ monthlyCA, activityType, familyStatus, versementLiberatoire }),
    [monthlyCA, activityType, familyStatus, versementLiberatoire]
  );
  const equivalentSalary = useMemo(
    () => calculateEquivalentSalaryForFreelanceNet({ monthlyCA, activityType, familyStatus, versementLiberatoire }),
    [monthlyCA, activityType, familyStatus, versementLiberatoire]
  );

  const verdictPositive = snapshot.salaryGapAtSameGross >= 0;
  const verdictLabel = verdictPositive
    ? `Vous gardez ${formatCurrency(Math.abs(snapshot.salaryGapAtSameGross))} de plus qu'un salarié à brut identique.`
    : `Vous gardez ${formatCurrency(Math.abs(snapshot.salaryGapAtSameGross))} de moins qu'un salarié à brut identique.`;

  return (
    <div className="seo-tool-card-grid">
      <div className="seo-tool-input-column">
        <div className="seo-tool-kicker">Simulateur public</div>
        <h2>CA mensuel → net freelance → équivalent salarié</h2>
        <p>Entrez votre chiffre d'affaires mensuel hors taxes. Le calcul s'actualise à chaque frappe.</p>

        <label className="seo-tool-label" htmlFor="brut-net-ca">CA mensuel HT</label>
        <div className="seo-tool-input-wrap">
          <input
            id="brut-net-ca"
            type="number"
            min={0}
            step={100}
            autoFocus
            value={monthlyCA}
            onChange={(event) => setMonthlyCA(Math.max(0, Number(event.target.value || 0)))}
            className="seo-tool-input"
          />
          <span>€ / mois</span>
        </div>

        <div className="seo-tool-field-group">
          <div className="seo-tool-label">Type d'activité</div>
          <ActivityButtons value={activityType} onChange={setActivityType} />
        </div>

        <div className="seo-tool-field-row">
          <div>
            <div className="seo-tool-label">Situation familiale</div>
            <FamilyButtons value={familyStatus} onChange={setFamilyStatus} />
          </div>
          <div>
            <div className="seo-tool-label">Fiscalité</div>
            <ToggleField
              checked={versementLiberatoire}
              onChange={setVersementLiberatoire}
              label="Versement libératoire"
            />
          </div>
        </div>
      </div>

      <div className="seo-tool-output-column">
        <div className="seo-tool-output-panel">
          <div className="seo-tool-panel-title">Votre net freelance</div>
          <div className="seo-tool-data-list">
            <div className="seo-tool-data-row">
              <span>Net après URSSAF</span>
              <strong>{formatCurrency(snapshot.netAfterUrssafMonthly)}</strong>
            </div>
            <div className="seo-tool-data-row is-highlight">
              <span>Net après URSSAF + IR</span>
              <strong>{formatCurrency(snapshot.netAfterTaxesMonthly)}</strong>
            </div>
            <div className="seo-tool-data-row">
              <span>Taux global de charges</span>
              <strong>{formatPercent(snapshot.globalChargeRate * 100)}</strong>
            </div>
            <div className="seo-tool-data-row is-muted">
              <span>Provision CFE conseillée</span>
              <strong>{formatCurrency(snapshot.cfeMonthly)}</strong>
            </div>
          </div>
        </div>

        <div className="seo-tool-output-panel">
          <div className="seo-tool-panel-title">Équivalent salarié</div>
          <div className="seo-tool-data-list">
            <div className="seo-tool-data-row">
              <span>Salaire brut équivalent</span>
              <strong>{formatCurrency(equivalentSalary.grossMonthlySalary)}</strong>
            </div>
            <div className="seo-tool-data-row">
              <span>Salaire net équivalent</span>
              <strong>{formatCurrency(equivalentSalary.netMonthlySalary)}</strong>
            </div>
            <div className="seo-tool-data-row is-muted">
              <span>TVA surveillée</span>
              <strong>{describeTvaStatus(snapshot.tvaPercentage)}</strong>
            </div>
          </div>
        </div>

        <div className="seo-tool-verdict-card">
          <div className={`seo-tool-verdict-badge ${verdictPositive ? 'is-positive' : 'is-negative'}`}>Verdict</div>
          <p>{verdictLabel}</p>
          <BarComparison
            leftLabel="Votre net freelance"
            leftValue={snapshot.netAfterTaxesMonthly}
            rightLabel="Net salarié à brut identique"
            rightValue={snapshot.salaryNetAtSameGross}
          />
        </div>
      </div>
    </div>
  );
}

function FreelanceVsSalarieCalculator() {
  const [salaryGross, setSalaryGross] = useState(3500);
  const [monthlyCA, setMonthlyCA] = useState(3000);
  const [activityType, setActivityType] = useState<ActivityType>('services_bnc');
  const [familyStatus, setFamilyStatus] = useState<PublicFamilyStatus>('celibataire');
  const [versementLiberatoire, setVersementLiberatoire] = useState(false);

  const salaryNet = useMemo(() => calculateSalariedNet(salaryGross), [salaryGross]);
  const snapshot = useMemo(
    () => calculateFreelanceSnapshot({ monthlyCA, activityType, familyStatus, versementLiberatoire }),
    [monthlyCA, activityType, familyStatus, versementLiberatoire]
  );
  const breakEvenCa = useMemo(
    () => calculateBreakEvenCaForSalary({ grossMonthlySalary: salaryGross, activityType, familyStatus, versementLiberatoire }),
    [salaryGross, activityType, familyStatus, versementLiberatoire]
  );
  const gap = snapshot.netAfterAllChargesMonthly - salaryNet;

  return (
    <div className="seo-tool-card-grid is-compare">
      <div className="seo-tool-input-column is-compare">
        <div className="seo-tool-compare-panels">
          <div className="seo-tool-mini-panel">
            <div className="seo-tool-panel-title">Je suis salarié</div>
            <label className="seo-tool-label" htmlFor="salary-gross">Salaire brut mensuel</label>
            <div className="seo-tool-input-wrap">
              <input
                id="salary-gross"
                type="number"
                min={0}
                step={100}
                autoFocus
                value={salaryGross}
                onChange={(event) => setSalaryGross(Math.max(0, Number(event.target.value || 0)))}
                className="seo-tool-input"
              />
              <span>€ / mois</span>
            </div>
            <div className="seo-tool-result-box">
              <span>Net salarié estimé</span>
              <strong>{formatCurrency(salaryNet)}</strong>
            </div>
          </div>

          <div className="seo-tool-mini-panel">
            <div className="seo-tool-panel-title">Je suis freelance</div>
            <label className="seo-tool-label" htmlFor="freelance-ca">CA mensuel</label>
            <div className="seo-tool-input-wrap">
              <input
                id="freelance-ca"
                type="number"
                min={0}
                step={100}
                value={monthlyCA}
                onChange={(event) => setMonthlyCA(Math.max(0, Number(event.target.value || 0)))}
                className="seo-tool-input"
              />
              <span>€ / mois</span>
            </div>
            <div className="seo-tool-result-box">
              <span>Net freelance estimé</span>
              <strong>{formatCurrency(snapshot.netAfterAllChargesMonthly)}</strong>
            </div>
          </div>
        </div>

        <div className="seo-tool-field-group">
          <div className="seo-tool-label">Type d'activité</div>
          <ActivityButtons value={activityType} onChange={setActivityType} />
        </div>

        <div className="seo-tool-field-row">
          <div>
            <div className="seo-tool-label">Situation familiale</div>
            <FamilyButtons value={familyStatus} onChange={setFamilyStatus} />
          </div>
          <div>
            <div className="seo-tool-label">Fiscalité</div>
            <ToggleField
              checked={versementLiberatoire}
              onChange={setVersementLiberatoire}
              label="Versement libératoire"
            />
          </div>
        </div>
      </div>

      <div className="seo-tool-output-column">
        <div className="seo-tool-verdict-card">
          <div className={`seo-tool-verdict-badge ${gap >= 0 ? 'is-positive' : 'is-negative'}`}>
            {gap >= 0 ? 'Avantage freelance' : 'Avantage salarié'}
          </div>
          <p>
            Différence mensuelle : <strong>{formatCurrency(Math.abs(gap))}</strong>{' '}
            en faveur du {gap >= 0 ? 'freelance' : 'salarié'}.
          </p>
          <BarComparison
            leftLabel="Net freelance"
            leftValue={snapshot.netAfterAllChargesMonthly}
            rightLabel="Net salarié"
            rightValue={salaryNet}
          />
        </div>

        <div className="seo-tool-output-panel">
          <div className="seo-tool-panel-title">Point d'équilibre</div>
          <div className="seo-tool-big-number">{formatCurrency(breakEvenCa)}</div>
          <p className="seo-tool-panel-copy">
            À partir de ce CA mensuel, le freelance dépasse le net salarié actuel selon vos réglages.
          </p>
        </div>

        <div className="seo-tool-output-panel is-split">
          <div>
            <span className="seo-tool-data-label">URSSAF + impôt</span>
            <strong>{formatCurrency(snapshot.urssafMonthly + snapshot.irMonthly)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">TVA projetée</span>
            <strong>{describeTvaStatus(snapshot.tvaPercentage)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">CFE mensuelle</span>
            <strong>{formatCurrency(snapshot.cfeMonthly)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">Salaire brut entré</span>
            <strong>{formatCurrency(salaryGross)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function TjmCalculator() {
  const [targetNet, setTargetNet] = useState(3500);
  const [billableDays, setBillableDays] = useState(15);
  const [activityType, setActivityType] = useState<ActivityType>('services_bnc');
  const [versementLiberatoire, setVersementLiberatoire] = useState(false);

  const requiredCa = useMemo(
    () => findMonthlyCaForTargetNet({ targetMonthlyNet: targetNet, activityType, versementLiberatoire, includeCfe: true }),
    [targetNet, activityType, versementLiberatoire]
  );
  const snapshot = useMemo(
    () => calculateFreelanceSnapshot({ monthlyCA: requiredCa, activityType, versementLiberatoire, familyStatus: 'celibataire' }),
    [requiredCa, activityType, versementLiberatoire]
  );

  const tjmMinimum = billableDays > 0 ? requiredCa / billableDays : 0;
  const tjmComfortable = tjmMinimum * 1.2;
  const equivalentGross = targetNet / 0.775;

  return (
    <div className="seo-tool-card-grid is-tjm">
      <div className="seo-tool-input-column">
        <div className="seo-tool-kicker">Calcul TJM</div>
        <h2>Partir du net visé pour fixer un tarif journalier défendable</h2>
        <p>Réglez votre objectif de net mensuel puis ajustez le nombre de jours facturables réalistes.</p>

        <label className="seo-tool-label" htmlFor="target-net">Objectif net mensuel</label>
        <div className="seo-tool-input-wrap">
          <input
            id="target-net"
            type="number"
            min={0}
            step={100}
            autoFocus
            defaultValue={3500}
            onChange={(event) => setTargetNet(Math.max(0, Number(event.target.value || 0)))}
            className="seo-tool-input"
          />
          <span>€ / mois</span>
        </div>

        <label className="seo-tool-label" htmlFor="billable-days">Jours facturables / mois</label>
        <div className="seo-tool-slider-row">
          <input
            id="billable-days"
            type="range"
            min={10}
            max={22}
            value={billableDays}
            onChange={(event) => setBillableDays(Number(event.target.value))}
            className="seo-tool-slider"
          />
          <strong>{billableDays} jours</strong>
        </div>

        <div className="seo-tool-field-group">
          <div className="seo-tool-label">Type d'activité</div>
          <ActivityButtons value={activityType} onChange={setActivityType} />
        </div>

        <ToggleField
          checked={versementLiberatoire}
          onChange={setVersementLiberatoire}
          label="Intégrer le versement libératoire"
        />

        <div className="seo-tool-days-card">
          <div className="seo-tool-panel-title">Pourquoi 15 à 16 jours facturables ?</div>
          <ul>
            <li>365 jours dans l'année</li>
            <li>- 104 week-ends</li>
            <li>- 25 jours de congés</li>
            <li>- 10 jours fériés</li>
            <li>- environ 30 jours non facturables</li>
            <li>= environ 196 jours facturables par an</li>
          </ul>
        </div>
      </div>

      <div className="seo-tool-output-column">
        <div className="seo-tool-output-panel">
          <div className="seo-tool-panel-title">TJM minimum recommandé</div>
          <div className="seo-tool-big-number">{formatCurrency(tjmMinimum)}</div>
          <p className="seo-tool-panel-copy">Le seuil à partir duquel votre objectif net est atteint avec vos jours facturables actuels.</p>
        </div>

        <div className="seo-tool-output-panel is-highlight-panel">
          <div>
            <span className="seo-tool-data-label">TJM confortable (+20%)</span>
            <strong>{formatCurrency(tjmComfortable)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">CA mensuel nécessaire</span>
            <strong>{formatCurrency(requiredCa)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">CA annuel nécessaire</span>
            <strong>{formatCurrency(requiredCa * 12)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">Salaire brut équivalent</span>
            <strong>{formatCurrency(equivalentGross)}</strong>
          </div>
        </div>

        <div className="seo-tool-output-panel is-split">
          <div>
            <span className="seo-tool-data-label">URSSAF mensuelle</span>
            <strong>{formatCurrency(snapshot.urssafMonthly)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">Impôt mensuel</span>
            <strong>{formatCurrency(snapshot.irMonthly)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">CFE mensuelle</span>
            <strong>{formatCurrency(snapshot.cfeMonthly)}</strong>
          </div>
          <div>
            <span className="seo-tool-data-label">Net recalculé</span>
            <strong>{formatCurrency(snapshot.netAfterAllChargesMonthly)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicSeoCalculator({ variant }: { variant: CalculatorVariant }) {
  if (variant === 'freelance-vs-salarie') {
    return <FreelanceVsSalarieCalculator />;
  }

  if (variant === 'tjm') {
    return <TjmCalculator />;
  }

  return <BrutNetCalculator />;
}

