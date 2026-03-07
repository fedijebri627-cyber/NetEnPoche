import { TAX_RATES_2026 } from '@/config/tax-rates-2026';

export type ActivityType = 'services_bic' | 'services_bnc' | 'vente' | 'liberal';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

// 1. getUrssafRate
export function getUrssafRate(activityType: ActivityType, acreEnabled: boolean): number {
    let baseRate = 0;
    switch (activityType) {
        case 'services_bic':
            baseRate = TAX_RATES_2026.URSSAF.SERVICES_BIC;
            break;
        case 'services_bnc':
            baseRate = TAX_RATES_2026.URSSAF.SERVICES_BNC;
            break;
        case 'liberal':
            baseRate = TAX_RATES_2026.URSSAF.LIBERAL;
            break;
        case 'vente':
            baseRate = TAX_RATES_2026.URSSAF.VENTE;
            break;
        default:
            throw new Error(`Unknown activity type: ${activityType}`);
    }

    return acreEnabled ? baseRate * TAX_RATES_2026.ACRE_MULTIPLIER : baseRate;
}

// 2. calculateUrssaf
export function calculateUrssaf(ca: number, activityType: ActivityType, acreEnabled: boolean): number {
    const rate = getUrssafRate(activityType, acreEnabled);
    return ca * rate;
}

// 3. getAbattement
export function getAbattement(activityType: ActivityType): number {
    switch (activityType) {
        case 'services_bic':
        case 'services_bnc':
            return TAX_RATES_2026.ABATTEMENT_IR.SERVICES_BIC;
        case 'liberal':
            return TAX_RATES_2026.ABATTEMENT_IR.LIBERAL;
        case 'vente':
            return TAX_RATES_2026.ABATTEMENT_IR.VENTE;
        default:
            throw new Error(`Unknown activity type: ${activityType}`);
    }
}

// 4. calculateIR
export interface IrParams {
    ca: number;
    activityType: ActivityType;
    versementLiberatoire: boolean;
    situationFamiliale: 'celibataire' | 'marie' | 'pacse';
    parts: number;
    autresRevenus: number;
}

export function calculateIR(params: IrParams): { irEstime: number; trancheMaginale: number; revenuImposable: number } {
    if (params.versementLiberatoire) {
        let vlRate = 0;
        switch (params.activityType) {
            case 'services_bic':
                vlRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BIC;
                break;
            case 'services_bnc':
            case 'liberal':
                vlRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BNC;
                break;
            case 'vente':
                vlRate = TAX_RATES_2026.VERSEMENT_LIBERATOIRE.VENTE;
                break;
        }
        const irAmount = params.ca * vlRate; // Does not factor autresRevenus
        return { irEstime: irAmount, trancheMaginale: vlRate, revenuImposable: params.ca };
    }

    const abattement = getAbattement(params.activityType);
    const revenuImposableCA = params.ca * (1 - abattement);
    const revenuImposableFoyer = revenuImposableCA + params.autresRevenus;

    // Barème progressif par part
    const quotientFamilial = revenuImposableFoyer / params.parts;

    let totalIrParPart = 0;
    let previousMax = 0;
    let tmi = 0;

    for (const bracket of TAX_RATES_2026.IR_BAREME) {
        if (quotientFamilial > previousMax) {
            tmi = bracket.rate;
            const amountInBracket = Math.min(quotientFamilial, bracket.max) - previousMax;
            totalIrParPart += amountInBracket * bracket.rate;
            previousMax = bracket.max;
        } else {
            break; // Reached the top bracket for this user
        }
    }

    const irSujetGlobal = totalIrParPart * params.parts;

    // Prorata to separate the AE IR from the rest of the household (Simplified estimation)
    const ratioAE = revenuImposableCA / revenuImposableFoyer;
    const irEstimeAE = revenuImposableFoyer > 0 ? irSujetGlobal * ratioAE : 0;

    return {
        irEstime: irEstimeAE,
        trancheMaginale: tmi,
        revenuImposable: revenuImposableCA
    };
}

// 5. calculateCFEProvision
export function calculateCFEProvision(ca: number, activityType: ActivityType): number {
    if (ca === 0) return 0;
    const provision = ca * TAX_RATES_2026.CFE_RATE;
    return Math.min(provision, TAX_RATES_2026.CFE_MAX_PROVISION);
}

// 6. getTVAStatus
export function getTVAStatus(cumulativeCA: number, activityType: ActivityType): {
    percentage: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
    threshold: number;
} {
    const threshold = (activityType === 'vente')
        ? TAX_RATES_2026.TVA_THRESHOLDS_FRANCHISE.VENTE
        : TAX_RATES_2026.TVA_THRESHOLDS_FRANCHISE.SERVICES;

    const percentage = (cumulativeCA / threshold) * 100;
    const remaining = Math.max(0, threshold - cumulativeCA);

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 85) status = 'warning';

    return { percentage, remaining, status, threshold };
}

// 7. calculateQuarterlyURSSAF
export interface MonthlyEntry {
    month: number;
    ca_amount: number;
}

export interface QuarterlyPayment {
    amount: number;
    dueDate: string;
    status: 'paid' | 'upcoming' | 'future';
}

export function calculateQuarterlyURSSAF(
    monthlyEntries: MonthlyEntry[],
    activityType: ActivityType,
    acreEnabled: boolean
): QuarterlyPayment[] {
    const q1 = monthlyEntries.filter(e => e.month >= 1 && e.month <= 3).reduce((acc, curr) => acc + curr.ca_amount, 0);
    const q2 = monthlyEntries.filter(e => e.month >= 4 && e.month <= 6).reduce((acc, curr) => acc + curr.ca_amount, 0);
    const q3 = monthlyEntries.filter(e => e.month >= 7 && e.month <= 9).reduce((acc, curr) => acc + curr.ca_amount, 0);
    const q4 = monthlyEntries.filter(e => e.month >= 10 && e.month <= 12).reduce((acc, curr) => acc + curr.ca_amount, 0);

    const rate = getUrssafRate(activityType, acreEnabled);

    // Simplified logic for "status" mapping (would generally map against current date)
    return [
        { amount: q1 * rate, dueDate: 'April 30', status: 'paid' }, // Hardcoded for simulation purposes
        { amount: q2 * rate, dueDate: 'July 31', status: 'upcoming' },
        { amount: q3 * rate, dueDate: 'October 31', status: 'future' },
        { amount: q4 * rate, dueDate: 'January 31', status: 'future' }
    ];
}

// 8. calculateNetReel
export function calculateNetReel(
    ca: number,
    activityType: ActivityType,
    acreEnabled: boolean,
    versementLiberatoire: boolean,
    irParams: IrParams
): { caBrut: number; urssaf: number; ir: number; cfe: number; netReel: number; tauxGlobal: number } {

    const urssaf = calculateUrssaf(ca, activityType, acreEnabled);
    const irResult = calculateIR({ ...irParams, ca, activityType, versementLiberatoire });
    const ir = irResult.irEstime;
    const cfe = calculateCFEProvision(ca, activityType);

    const totalCharges = urssaf + ir + cfe;
    const netReel = ca - totalCharges;
    const tauxGlobal = ca > 0 ? totalCharges / ca : 0;

    return { caBrut: ca, urssaf, ir, cfe, netReel, tauxGlobal };
}

// 9. calculateAnnualProjection
export function calculateAnnualProjection(monthlyEntries: MonthlyEntry[], currentMonth: number): number {
    if (currentMonth === 0) return 0;
    const totalCaToDate = monthlyEntries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const avgMonthly = totalCaToDate / currentMonth;
    return avgMonthly * 12;
}

// 10. calculateHealthScore
export interface HealthScoreParams {
    monthsEnteredCount: number;
    currentMonth: number;
    caSourcesCount: number; // e.g. number of unique clients
    netMarginPercentage: number;
    tvaStatus: 'safe' | 'warning' | 'danger';
    cfeAccountedFor: boolean;
}

export interface ScoreBreakdown {
    regularite: number;
    diversification: number;
    marge: number;
    tva: number;
    cfe: number;
}

export function calculateHealthScore(params: HealthScoreParams): { score: number; breakdown: ScoreBreakdown } {
    let score = 0;

    // 1. Régularité saisies (20pts)
    const entryRatio = params.currentMonth > 0 ? (params.monthsEnteredCount / params.currentMonth) : 0;
    const regulariteScore = Math.min(20, Math.round(entryRatio * 20));
    score += regulariteScore;

    // 2. Diversification CA (20pts) -> simplified: 3+ sources is 20pts
    let divScore = 0;
    if (params.caSourcesCount >= 3) divScore = 20;
    else if (params.caSourcesCount === 2) divScore = 10;
    else if (params.caSourcesCount === 1) divScore = 5;
    score += divScore;

    // 3. Marge nette (30pts) -> simplified: >50% margin maxes out
    const margeScore = Math.min(30, Math.round((Math.max(0, params.netMarginPercentage) / 0.5) * 30));
    score += margeScore;

    // 4. Gestion TVA (15pts)
    let tvaScore = 15;
    if (params.tvaStatus === 'danger') tvaScore = 0;
    if (params.tvaStatus === 'warning') tvaScore = 7;
    score += tvaScore;

    // 5. Prévoyance CFE (15pts)
    const cfeScore = params.cfeAccountedFor ? 15 : 0;
    score += cfeScore;

    return {
        score: Math.min(100, score),
        breakdown: {
            regularite: regulariteScore,
            diversification: divScore,
            marge: margeScore,
            tva: tvaScore,
            cfe: cfeScore
        }
    };
}
