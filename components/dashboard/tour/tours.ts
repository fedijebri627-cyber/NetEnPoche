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
                target: 'dashboard-priorities',
                title: 'Le centre de pilotage commence ici',
                description: 'Cette zone trie vos trois priorités du moment. C’est le point d’entrée pour savoir quoi faire ensuite sans relire tout le dashboard.',
                placement: 'bottom',
            },
            {
                target: 'dashboard-kpis',
                title: 'Les quatre chiffres à surveiller',
                description: 'URSSAF, net réellement disponible, provision CFE et projection annuelle donnent la lecture rapide de votre situation actuelle.',
                placement: 'bottom',
            },
            {
                target: 'activity-config',
                title: 'Votre profil fiscal pilote tous les calculs',
                description: 'Type d’activité, ACRE, versement libératoire et mix d’activités influencent les cartes de réserve, TVA et optimisation.',
                placement: 'right',
            },
            {
                target: 'monthly-entries',
                title: 'Saisissez ici votre chiffre d’affaires',
                description: 'Chaque ligne correspond à un mois encaissé. Plus cette table est complète, plus vos alertes et projections deviennent fiables.',
                placement: 'right',
            },
            {
                target: 'actions-timeline',
                title: 'Les alertes prioritaires sont regroupées ici',
                description: 'Cette timeline remonte vos prochains points d’attention: échéance URSSAF, risque TVA, objectif annuel et éventuels mois manquants.',
                placement: 'left',
            },
            {
                target: 'scenario-lab',
                title: 'Testez un changement avant de le subir',
                description: 'Le scénario lab vous aide à mesurer l’impact d’une facture en plus, d’une hausse de prix, d’un passage TVA ou d’une option fiscale.',
                placement: 'top',
            },
            {
                target: 'revenue-chart',
                title: 'Le graphique montre la répartition réelle',
                description: 'Vous visualisez mois par mois ce qui part en URSSAF et ce qui reste en net. Passez en cumulé pour lire votre trajectoire annuelle.',
                placement: 'top',
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
                target: 'optimisation-hero',
                title: 'Cette page sert à décider, pas seulement à calculer',
                description: 'Ici vous comparez vos options fiscales, votre réserve, votre net et vos scénarios avant de facturer ou de changer de stratégie.',
                placement: 'bottom',
            },
            {
                target: 'optimisation-reserve',
                title: 'La réserve et l’évolution du net se lisent ensemble',
                description: 'Ces cartes montrent ce qu’il faut mettre de côté et pourquoi votre net change, pour éviter les mauvaises surprises de trésorerie.',
                placement: 'bottom',
            },
            {
                target: 'optimisation-profile',
                title: 'Paramétrez ici votre foyer fiscal',
                description: 'Situation familiale, parts fiscales, autres revenus et option versement libératoire modifient directement l’estimation d’impôt.',
                placement: 'right',
            },
            {
                target: 'optimisation-waterfall',
                title: 'Le waterfall décompose le chemin du CA au net',
                description: 'Vous voyez clairement ce qui part en URSSAF, impôt et CFE avant d’arriver à votre poche réelle.',
                placement: 'left',
            },
            {
                target: 'optimisation-scenario',
                title: 'Les simulations servent à arbitrer',
                description: 'Utilisez cette zone pour tester un nouveau tarif, une facture supplémentaire ou une bascule TVA avant qu’elle n’arrive en réel.',
                placement: 'top',
            },
            {
                target: 'optimisation-history',
                title: 'La revue annuelle se consulte exercice par exercice',
                description: 'Le sélecteur d’année permet de comparer proprement chaque exercice sans surcharger l’écran.',
                placement: 'left',
            },
            {
                target: 'tour-guide-button',
                title: 'Besoin d’un rappel plus tard ?',
                description: 'Relancez ce tour depuis le bouton Guide de la top bar. Il s’adapte automatiquement à la page sur laquelle vous êtes.',
                placement: 'bottom',
            },
        ],
    },
    '/dashboard/expert': {
        label: 'Tour clients et facturation',
        steps: [
            {
                target: 'expert-hero',
                title: 'L’espace Expert centralise votre cash client',
                description: 'Cette page transforme vos clients, vos factures et vos relances en vue opérationnelle de trésorerie.',
                placement: 'bottom',
            },
            {
                target: 'expert-client-form',
                title: 'Commencez par créer votre portefeuille client',
                description: 'Ajoutez ici vos clients B2B ou B2C. Chaque fiche servira ensuite à vos factures, à la concentration de revenus et aux relances.',
                placement: 'right',
            },
            {
                target: 'expert-invoice-form',
                title: 'Ensuite, saisissez vos factures',
                description: 'Une facture alimente à la fois vos encaissements, votre suivi client et vos métriques de retard ou de cash en attente.',
                placement: 'right',
            },
            {
                target: 'expert-portfolio',
                title: 'Le portefeuille donne la vue client consolidée',
                description: 'Vous retrouvez ici vos clients, leur poids dans votre chiffre d’affaires et leur historique de facturation.',
                placement: 'top',
            },
            {
                target: 'expert-collections',
                title: 'Le cockpit de recouvrement suit le cash à récupérer',
                description: 'Cette zone met en avant les montants en retard, les échéances proches et les actions de relance à exécuter.',
                placement: 'left',
            },
            {
                target: 'expert-insights',
                title: 'Les insights clients révèlent vos dépendances',
                description: 'Concentration de revenus, ticket moyen, retards et score financier vous aident à identifier les vrais risques commerciaux.',
                placement: 'left',
            },
            {
                target: 'expert-admin-pack',
                title: 'Les exports et packs admin partent de cette zone',
                description: 'Téléchargez ici vos fichiers banque, comptable ou migration selon le format dont vous avez besoin.',
                placement: 'right',
            },
            {
                target: 'tour-guide-button',
                title: 'Le guide reste toujours dans la top bar',
                description: 'Relancez le tour de cette page à tout moment avec ce bouton. Le contenu change automatiquement selon l’écran ouvert.',
                placement: 'bottom',
            },
        ],
    },
};

export function getTourForPath(pathname: string | null | undefined) {
    if (!pathname) return null;
    return DASHBOARD_TOURS[pathname] ?? null;
}
