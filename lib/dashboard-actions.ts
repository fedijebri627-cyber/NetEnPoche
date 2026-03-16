import {
    buildDecisionTimeline,
    buildHealthScoreInsight,
    buildReservePlan,
    formatCurrency,
    getCompositeTvaStatus,
    type InsightConfig,
    type InsightMonthlyEntry,
    type TimelineSeverity,
} from '@/lib/dashboard-insights';

export type PriorityActionKind = 'scroll' | 'route' | 'onboarding';

export interface PriorityAction {
    id: string;
    title: string;
    detail: string;
    value: string;
    ctaLabel: string;
    severity: TimelineSeverity;
    kind: PriorityActionKind;
    targetId?: string;
    route?: string;
}

function severityRank(severity: TimelineSeverity) {
    if (severity === 'critical') return 0;
    if (severity === 'watch') return 1;
    return 2;
}

export function buildPriorityActions(entries: InsightMonthlyEntry[], config: InsightConfig): PriorityAction[] {
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const currentMonth = config.year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const filledMonths = entries.filter((entry) => Number(entry.ca_amount || 0) > 0).length;
    const missingMonths = entries
        .filter((entry) => entry.month <= currentMonth && Number(entry.ca_amount || 0) === 0)
        .map((entry) => entry.month);
    const reserve = buildReservePlan(entries, config);
    const tva = getCompositeTvaStatus(totalCA, config);
    const health = buildHealthScoreInsight(entries, config);
    const annualGoal = Number(config.annual_ca_goal || 0);
    const expectedPace = annualGoal > 0 ? (annualGoal / 12) * Math.max(currentMonth, 1) : 0;
    const paceGap = Math.max(0, expectedPace - totalCA);
    const timeline = buildDecisionTimeline(entries, config);

    const actions: PriorityAction[] = [];

    if (filledMonths === 0) {
        actions.push({
            id: 'first-entry',
            title: 'Activez votre cockpit en saisissant un premier mois de CA',
            detail: 'Sans premier encaissement, les projections et alertes restent quasi inactives.',
            value: '2 min',
            ctaLabel: 'Saisir mon premier CA',
            severity: 'watch',
            kind: 'scroll',
            targetId: 'monthly-entries',
        });
    }

    if (reserve.totalReserve > 0) {
        actions.push({
            id: 'reserve',
            title: 'Mettez votre trésorerie de sécurité de côté maintenant',
            detail: `Gardez ${formatCurrency(reserve.totalReserve)} pour couvrir URSSAF, impôt et CFE sans tension.`,
            value: formatCurrency(reserve.safeToSpend),
            ctaLabel: 'Voir la réserve',
            severity: reserve.reserveRate >= 0.35 ? 'critical' : 'watch',
            kind: 'scroll',
            targetId: 'reserve-card',
        });
    }

    if (!annualGoal) {
        actions.push({
            id: 'goal-missing',
            title: 'Définissez un objectif annuel pour piloter votre rythme',
            detail: "L'objectif active les alertes de cadence et la lecture de votre avance ou retard.",
            value: 'À définir',
            ctaLabel: 'Renseigner mon objectif',
            severity: 'watch',
            kind: 'onboarding',
        });
    } else if (paceGap > 0) {
        actions.push({
            id: 'goal-gap',
            title: 'Vous êtes sous le rythme de votre objectif annuel',
            detail: `Il manque ${formatCurrency(paceGap)} pour rester au niveau attendu à date.`,
            value: `${Math.round((totalCA / annualGoal) * 100)}%`,
            ctaLabel: 'Revoir mon objectif',
            severity: paceGap > annualGoal * 0.12 ? 'critical' : 'watch',
            kind: 'onboarding',
        });
    }

    if (tva.status !== 'safe') {
        actions.push({
            id: 'tva-risk',
            title: tva.status === 'danger' ? 'Préparez votre bascule TVA' : 'Surveillez de près votre seuil TVA',
            detail: tva.status === 'danger'
                ? 'Votre franchise est franchie ou quasiment franchie. Vérifiez vos prix et vos prochaines factures.'
                : 'Votre marge de sécurité TVA se réduit. Anticipez votre scénario de dépassement.',
            value: `${tva.percentage.toFixed(0)}%`,
            ctaLabel: 'Voir le suivi TVA',
            severity: tva.status === 'danger' ? 'critical' : tva.status === 'warning' ? 'watch' : 'good',
            kind: 'route',
            route: '/dashboard/optimisation?focus=optimisation-actions-fiscales#optimisation-actions-fiscales',
        });
    }

    if (missingMonths.length > 0 && filledMonths > 0) {
        actions.push({
            id: 'missing-months',
            title: 'Complétez vos mois manquants pour fiabiliser les alertes',
            detail: `Il vous manque ${missingMonths.length} mois saisis sur l'exercice en cours.`,
            value: `${missingMonths.length} mois`,
            ctaLabel: 'Compléter la table CA',
            severity: missingMonths.length >= 3 ? 'critical' : 'watch',
            kind: 'scroll',
            targetId: 'monthly-entries',
        });
    }

    if (health.score < 70) {
        actions.push({
            id: 'optimisation',
            title: 'Votre score de pilotage peut être amélioré rapidement',
            detail: "Passez par l'optimisation pour comparer votre poche nette, votre option fiscale et votre trajectoire.",
            value: `${health.score}/100`,
            ctaLabel: "Ouvrir l'optimisation",
            severity: health.score < 55 ? 'critical' : 'watch',
            kind: 'route',
            route: '/dashboard/optimisation',
        });
    }

    if (actions.length < 3) {
        const urssafItem = timeline.find((item) => item.id === 'urssaf');
        if (urssafItem) {
            actions.push({
                id: 'urssaf-deadline',
                title: urssafItem.title,
                detail: urssafItem.detail,
                value: urssafItem.value,
                ctaLabel: "Voir l'échéancier",
                severity: urssafItem.severity,
                kind: 'scroll',
                targetId: 'urssaf-deadline-card',
            });
        }
    }

    if (actions.length < 3) {
        actions.push({
            id: 'onboarding-refresh',
            title: 'Votre situation a changé ?',
            detail: 'Mettez à jour votre profil fiscal en 2 minutes pour garder des priorités fiables.',
            value: 'Rapide',
            ctaLabel: "Relancer l'onboarding",
            severity: 'good',
            kind: 'onboarding',
        });
    }

    return actions
        .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
        .slice(0, 3);
}
