export type TourPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface TourStep {
    target: string;
    title: string;
    description: string;
    placement?: TourPlacement;
}

export interface TourDefinition {
    label: string;
    steps: TourStep[];
}

export const DASHBOARD_TOURS: Record<string, TourDefinition> = {
    '/dashboard': {
        label: 'Tour du dashboard',
        steps: [
            {
                target: 'dashboard-kpis',
                title: 'Les quatre chiffres à surveiller',
                description: 'Net réel, URSSAF à payer, réserve totale et seuil TVA donnent la lecture immédiate de votre situation.',
                placement: 'bottom',
            },
            {
                target: 'dashboard-priority-list',
                title: 'Les priorités remontent ici',
                description: 'Cette carte trie vos trois prochaines actions utiles, avec un raccourci direct vers la bonne zone.',
                placement: 'bottom',
            },
            {
                target: 'monthly-entries',
                title: 'La table CA reste votre base de pilotage',
                description: 'Chaque mois saisi alimente vos projections, votre réserve, vos alertes TVA et vos échéances URSSAF.',
                placement: 'right',
            },
            {
                target: 'urssaf-deadline-card',
                title: "L'échéance URSSAF est visible dès le premier écran",
                description: 'Le montant et la date limite restent visibles sans défiler, pour ne jamais rater le prochain paiement.',
                placement: 'left',
            },
            {
                target: 'health-score-card',
                title: 'Le score de santé reste compact',
                description: 'Il condense régularité, marge, diversification, TVA et CFE dans un format plus lisible.',
                placement: 'left',
            },
            {
                target: 'scenario-lab',
                title: 'Le scénario lab est maintenant au cœur du parcours',
                description: 'Testez une facture, une hausse de prix, un passage TVA ou une option fiscale sans descendre en bas de page.',
                placement: 'top',
            },
            {
                target: 'actions-timeline',
                title: 'Les actions en attente regroupent les urgences',
                description: 'Retards clients, échéance URSSAF et mois de CA manquants se retrouvent ici dans une seule liste.',
                placement: 'left',
            },
            {
                target: 'tour-guide-button',
                title: 'Le guide reste disponible ici',
                description: 'Vous pouvez relancer à tout moment le tour correspondant à la page ouverte depuis ce bouton dans la top bar.',
                placement: 'bottom',
            },
        ],
    },
    '/dashboard/optimisation': {
        label: 'Tour optimisation',
        steps: [
            {
                target: 'optimisation-waterfall',
                title: 'Le waterfall est la réponse principale',
                description: "Vous voyez tout de suite comment le chiffre d'affaires descend jusqu'au net réel en poche.",
                placement: 'bottom',
            },
            {
                target: 'why-net',
                title: 'Cette carte explique les variations récentes',
                description: "La lecture du net change vient maintenant à côté du waterfall, au bon endroit pour comprendre les écarts.",
                placement: 'left',
            },
            {
                target: 'optimisation-profile',
                title: 'Le profil fiscal pilote la simulation',
                description: 'Situation familiale, parts, autres revenus et versement libératoire modifient directement les calculs.',
                placement: 'right',
            },
            {
                target: 'scenario-lab',
                title: 'Les simulations servent à arbitrer',
                description: "Testez vos choix avant qu'ils n'impactent votre trésorerie réelle.",
                placement: 'top',
            },
            {
                target: 'optimisation-history',
                title: 'La revue multi-années reste en appui',
                description: 'Elle permet de relire chaque exercice sans allonger inutilement la page.',
                placement: 'left',
            },
            {
                target: 'tour-guide-button',
                title: 'Le guide reste accessible ici',
                description: "Relancez ce tour depuis la top bar. Il s'adapte automatiquement à la page ouverte.",
                placement: 'bottom',
            },
        ],
    },
    '/dashboard/expert': {
        label: 'Tour clients et facturation',
        steps: [
            {
                target: 'expert-hero',
                title: 'Cette page pilote votre cash client',
                description: 'Elle rassemble clients, factures ouvertes, concentration et exports dans une seule vue opérationnelle.',
                placement: 'bottom',
            },
            {
                target: 'expert-portfolio',
                title: 'Le portefeuille client ouvre la page',
                description: 'Vous retrouvez ici vos clients actifs et le raccourci inline pour en ajouter un nouveau.',
                placement: 'right',
            },
            {
                target: 'expert-invoice-form',
                title: 'Les factures alimentent tout le reste',
                description: 'Chaque facture mise à jour se répercute sur le cash en attente, les relances et les risques client.',
                placement: 'right',
            },
            {
                target: 'expert-collections',
                title: 'La liste collections devient le cœur du suivi',
                description: 'Les factures en cours sont triées par urgence et vous pouvez relancer ou marquer payée directement ici.',
                placement: 'left',
            },
            {
                target: 'expert-insights',
                title: 'La concentration et le score restent visibles',
                description: 'Le bloc de droite montre quels clients pèsent le plus et quel levier financier travailler ensuite.',
                placement: 'left',
            },
            {
                target: 'expert-admin-pack',
                title: 'Les exports sont regroupés ici',
                description: 'Pack Excel, banque, comptable et format Qonto restent disponibles dans une grille plus compacte.',
                placement: 'right',
            },
            {
                target: 'tour-guide-button',
                title: 'Le guide reste toujours dans la top bar',
                description: 'Relancez ce tour à tout moment depuis ce bouton.',
                placement: 'bottom',
            },
        ],
    },
};

export function getTourForPath(pathname: string | null | undefined) {
    if (!pathname) return null;
    return DASHBOARD_TOURS[pathname] ?? null;
}
