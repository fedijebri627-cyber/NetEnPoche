export type SeoLandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingSection = {
  title: string;
  text: string;
};

export type SeoLandingSource = {
  title: string;
  url: string;
  publisher: string;
};

export type SeoLandingPage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  cardTitle: string;
  cardDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  highlights: string[];
  sections: SeoLandingSection[];
  faq: SeoLandingFaq[];
  updatedAt: string;
  officialSources: SeoLandingSource[];
};

const microSources = {
  urssafStatus: {
    title: "L'essentiel du statut micro-entrepreneur",
    url: 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/lessentiel-du-statut.html',
    publisher: 'URSSAF',
  },
  tvaThresholds: {
    title: 'Franchise en base de TVA : seuils et obligations',
    url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746',
    publisher: 'Service-Public.fr',
  },
  versementLiberatoire: {
    title: "Versement libératoire de l'impôt sur le revenu",
    url: 'https://www.impots.gouv.fr/professionnel/le-versement-liberatoire',
    publisher: 'impots.gouv.fr',
  },
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: 'calcul-urssaf',
    title: 'Calcul URSSAF 2026 : cotisations, TVA et net micro-entrepreneur',
    description:
      'Guide et simulateur de calcul URSSAF pour micro-entrepreneurs. Estimez vos cotisations, la TVA et votre vrai net après charges en 2026.',
    keywords: [
      'calcul urssaf',
      'calcule urssaf',
      'simulateur urssaf',
      'cotisations urssaf micro entrepreneur',
      'calcul charges urssaf',
    ],
    cardTitle: 'Calcul URSSAF 2026',
    cardDescription:
      'Une page dédiée à la requête la plus large, recentrée sur les cotisations, la TVA et le vrai net du micro-entrepreneur.',
    heroEyebrow: 'Guide micro-entrepreneur 2026',
    heroTitle: 'Calcul URSSAF : combien vous reste-t-il vraiment après cotisations ?',
    heroSubtitle:
      'Quand quelqu’un cherche "calcule urssaf", il veut rarement un tableau théorique. Il veut connaître ses cotisations, son seuil de TVA et ce qu’il garde réellement. NetEnPoche regroupe ces trois réponses dans la même simulation.',
    highlights: [
      "Estimer rapidement les cotisations URSSAF à partir du chiffre d'affaires déclaré.",
      'Visualiser le moment où la TVA commence à peser sur votre rentabilité.',
      "Projeter votre net après impôt pour éviter les mauvaises surprises en fin d'année.",
    ],
    sections: [
      {
        title: "Un calcul URSSAF utile ne s'arrête pas aux cotisations",
        text:
          "Les résultats Google montrent souvent des outils généralistes URSSAF, parfois orientés employeur ou salarié. Pour un micro-entrepreneur, le bon calcul doit partir du chiffre d'affaires, intégrer les cotisations sociales, signaler la TVA et replacer le tout dans une logique de revenu net.",
      },
      {
        title: "Le vrai point de friction, c'est le passage du CA au net",
        text:
          "Beaucoup de freelances connaissent leur chiffre d'affaires mais pas le montant qu'ils pourront réellement conserver. C'est là que NetEnPoche se distingue : le produit ne montre pas seulement la charge URSSAF, il relie cotisations, fiscalité et projection annuelle.",
      },
      {
        title: 'Pourquoi cette page existe à côté de la homepage',
        text:
          "La page d'accueil vend le produit. Cette page répond d'abord à une intention de recherche. Elle sert d'entrée SEO pour les internautes qui veulent comprendre et calculer avant de s'inscrire.",
      },
    ],
    faq: [
      {
        question: 'Comment calculer ses cotisations URSSAF en micro-entreprise ?',
        answer:
          "Le calcul part du chiffre d'affaires encaissé, auquel on applique le taux correspondant à votre activité. Mais pour piloter votre activité, il faut aller plus loin et relier ce montant au seuil de TVA et à l'impôt sur le revenu.",
      },
      {
        question: 'Pourquoi le résultat URSSAF ne suffit-il pas à connaître son vrai net ?',
        answer:
          "Parce que les cotisations sociales ne sont qu'une partie de l'équation. Un micro-entrepreneur doit aussi surveiller la TVA, anticiper l'impôt et comparer ces montants à son chiffre d'affaires pour mesurer sa marge réelle.",
      },
      {
        question: "NetEnPoche remplace-t-il le site officiel de l'URSSAF ?",
        answer:
          "Non. Le site officiel reste la référence pour les obligations déclaratives. NetEnPoche sert à mieux comprendre, anticiper et visualiser l'impact financier avant de déclarer.",
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'calcul-urssaf-auto-entrepreneur',
    title: 'Calcul URSSAF auto-entrepreneur : cotisations et TVA en 2026',
    description:
      'Calculez vos cotisations URSSAF auto-entrepreneur, surveillez la TVA et estimez votre revenu disponible avec un simulateur pensé pour les freelances français.',
    keywords: [
      'calcul urssaf auto entrepreneur',
      'simulateur urssaf auto entrepreneur',
      'cotisations auto entrepreneur',
      'micro entrepreneur urssaf calcul',
      'charges auto entrepreneur 2026',
    ],
    cardTitle: 'Calcul URSSAF auto-entrepreneur',
    cardDescription:
      "Une page plus ciblée pour les auto-entrepreneurs qui veulent estimer leurs charges et comprendre l'impact TVA plus impôt.",
    heroEyebrow: 'Auto-entrepreneur',
    heroTitle: "Calcul URSSAF auto-entrepreneur : du chiffre d'affaires au revenu disponible",
    heroSubtitle:
      "Les auto-entrepreneurs ne cherchent pas seulement un taux. Ils cherchent un simulateur qui relie cotisations sociales, franchise de TVA et revenu final.",
    highlights: [
      "Faire le lien entre chiffre d'affaires encaissé et cotisations à déclarer.",
      'Repérer plus tôt les seuils de franchise en base de TVA.',
      'Comparer votre net avec ou sans versement libératoire.',
    ],
    sections: [
      {
        title: "Le calcul change selon l'activité, mais le besoin reste le même",
        text:
          "Prestations de service, vente, activités mixtes : les bases de calcul ne se lisent pas de la même façon. En revanche, l'objectif du freelance reste identique. Il veut transformer un chiffre d'affaires brut en décision simple.",
      },
      {
        title: 'La TVA fausse souvent la lecture du revenu',
        text:
          "Tant que la franchise en base n'est pas dépassée, le calcul semble simple. Mais dès qu'un seuil approche, le montant encaissé ne reflète plus le revenu réel.",
      },
      {
        title: 'Un simulateur utile doit aussi aider à prioriser',
        text:
          "NetEnPoche ne se limite pas à une réponse unique. Il montre les prochains points de vigilance : déclaration URSSAF, alertes, évolution annuelle et arbitrage fiscal.",
      },
    ],
    faq: [
      {
        question: "Quelle est la différence entre chiffre d'affaires et net auto-entrepreneur ?",
        answer:
          "Le chiffre d'affaires correspond à ce que vous encaissez. Le net correspond à ce qu'il reste après cotisations sociales, éventuellement TVA, puis impôt sur le revenu selon votre situation.",
      },
      {
        question: 'Faut-il inclure la TVA dans un calcul URSSAF auto-entrepreneur ?',
        answer:
          "La TVA n'entre pas directement dans le calcul des cotisations, mais elle modifie fortement la lecture de votre revenu disponible et de vos factures.",
      },
      {
        question: 'Pourquoi comparer avec et sans versement libératoire ?',
        answer:
          "Parce que le choix fiscal peut changer le montant final conservé. Il est utile de voir si cette option vous fait économiser ou non sur l'année.",
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'calcul-net-auto-entrepreneur',
    title: 'Calcul net auto-entrepreneur : après URSSAF, TVA et impôt',
    description:
      "Calculez le net auto-entrepreneur après URSSAF, TVA et impôt sur le revenu. Une page pensée pour les indépendants qui veulent un chiffre exploitable.",
    keywords: [
      'calcul net auto entrepreneur',
      'net auto entrepreneur apres charges',
      'revenu net micro entrepreneur',
      'simulateur net auto entrepreneur',
      'urssaf net micro entrepreneur',
    ],
    cardTitle: 'Calcul net auto-entrepreneur',
    cardDescription:
      "Une entrée SEO pour les personnes qui ne cherchent pas un taux de cotisation, mais le revenu net réel après URSSAF et impôt.",
    heroEyebrow: 'Vrai net',
    heroTitle: 'Calcul net auto-entrepreneur : le chiffre qui compte vraiment',
    heroSubtitle:
      "La plupart des outils s'arrêtent au montant des charges. Cette page cible une intention plus avancée : connaître le net final après URSSAF, seuils de TVA et impôt sur le revenu.",
    highlights: [
      "Passer d'un chiffre d'affaires mensuel à un net réellement disponible.",
      "Projeter l'impact de l'impôt sur le revenu sur toute l'année fiscale.",
      'Préparer une décision concrète : se verser, épargner, investir ou lisser sa trésorerie.',
    ],
    sections: [
      {
        title: 'Le net perçu est la vraie métrique de pilotage',
        text:
          "Un freelance ne pilote pas son activité avec un taux URSSAF seul. Il pilote avec un reste à vivre, une trésorerie et une visibilité sur les prochains paiements.",
      },
      {
        title: "Le bon message n'est pas combien payer, mais combien garder",
        text:
          "Les pages officielles répondent bien aux obligations. Votre avantage produit est ailleurs : transformer une mécanique administrative en lecture financière simple.",
      },
      {
        title: 'Une meilleure page SEO doit aussi nourrir la conversion',
        text:
          "Quelqu'un qui cherche son net est généralement plus proche de l'inscription qu'un internaute qui cherche seulement une définition.",
      },
    ],
    faq: [
      {
        question: 'Comment estimer son net auto-entrepreneur chaque mois ?',
        answer:
          "Il faut partir du chiffre d'affaires encaissé, retirer les cotisations sociales correspondantes, puis projeter l'impact de la TVA et de l'impôt sur le revenu.",
      },
      {
        question: "Pourquoi le net varie-t-il autant d'un mois à l'autre ?",
        answer:
          "Parce qu'il dépend du niveau de chiffre d'affaires, de la saisonnalité, de l'approche des seuils TVA, du choix fiscal et de la manière dont vous lissez vos charges.",
      },
      {
        question: 'À quoi sert un PDF bilan dans ce contexte ?',
        answer:
          'Un bilan PDF structuré permet de transformer vos calculs en document exploitable pour une banque, un bailleur ou un partenaire.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'tva-micro-entreprise',
    title: 'TVA micro-entreprise 2026 : seuils, franchise et vrai impact sur votre net',
    description:
      'Comprenez la TVA en micro-entreprise : franchise en base, seuils, dépassement et impact sur votre revenu réel en 2026.',
    keywords: [
      'tva micro entreprise',
      'franchise en base tva micro entreprise',
      'seuil tva micro entrepreneur',
      'tva auto entrepreneur 2026',
      'depassement tva micro entreprise',
    ],
    cardTitle: 'TVA micro-entreprise',
    cardDescription:
      'Une page pour les freelances qui approchent les seuils de TVA et veulent comprendre ce que cela change concrètement.',
    heroEyebrow: 'TVA et seuils',
    heroTitle: "TVA micro-entreprise : le moment où votre CA ne raconte plus toute l'histoire",
    heroSubtitle:
      "Le sujet n'est pas seulement de savoir si vous êtes encore en franchise de TVA. Le vrai enjeu est de comprendre à partir de quel moment votre revenu disponible et vos factures changent.",
    highlights: [
      'Voir les seuils de franchise en base par activité.',
      'Comprendre ce qui change quand un seuil est dépassé.',
      'Relier la TVA à votre net, pas seulement à une obligation administrative.',
    ],
    sections: [
      {
        title: "La TVA micro-entreprise est d'abord un sujet de pilotage",
        text:
          "Beaucoup d'indépendants regardent la TVA comme une formalité. En réalité, c'est un point de bascule sur vos prix, votre marge et votre façon de présenter vos factures.",
      },
      {
        title: 'Le dépassement des seuils est souvent ressenti trop tard',
        text:
          "Le risque n'est pas seulement de dépasser un chiffre. Le risque est de continuer à lire son activité comme si tout ce qui était encaissé pouvait être gardé.",
      },
      {
        title: 'Pourquoi cette page est SEO-stratégique',
        text:
          'La requête TVA micro-entreprise est plus spécifique et plus accessible que calcul urssaf. Elle attire une audience qui a déjà un vrai problème à résoudre.',
      },
    ],
    faq: [
      {
        question: "Qu'est-ce que la franchise en base de TVA ?",
        answer:
          "C'est le régime qui permet à une micro-entreprise de ne pas facturer la TVA tant que certains seuils de chiffre d'affaires ne sont pas dépassés.",
      },
      {
        question: 'Pourquoi la TVA change-t-elle mon vrai net ?',
        answer:
          "Parce qu'une partie de ce que vous facturez n'est plus un revenu gardé. Sans lecture claire, vous pouvez surestimer votre marge disponible.",
      },
      {
        question: 'Pourquoi suivre la TVA dans NetEnPoche ?',
        answer:
          "Parce que le suivi du seuil vous aide à anticiper plutôt qu'à subir. Le bon moment pour agir se voit avant le dépassement, pas après.",
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.tvaThresholds, microSources.urssafStatus],
  },
  {
    slug: 'plafond-tva-auto-entrepreneur',
    title: 'Plafond TVA auto-entrepreneur 2026 : quand agir avant le dépassement',
    description:
      "Surveillez le plafond TVA auto-entrepreneur, comprenez les seuils et anticipez leur impact sur vos factures, votre marge et votre rythme de croissance.",
    keywords: [
      'plafond tva auto entrepreneur',
      'seuil tva auto entrepreneur 2026',
      'quand facturer la tva auto entrepreneur',
      'depassement plafond tva micro entrepreneur',
      'franchise tva auto entrepreneur',
    ],
    cardTitle: 'Plafond TVA auto-entrepreneur',
    cardDescription:
      "Une page centrée sur le moment où les seuils TVA approchent et sur ce qu'il faut faire avant d'être rattrapé.",
    heroEyebrow: 'Seuils TVA',
    heroTitle: 'Plafond TVA auto-entrepreneur : comment voir venir le changement avant qu’il arrive',
    heroSubtitle:
      "Le bon réflexe n'est pas seulement de connaître un plafond. C'est de savoir à quel rythme vous allez l'approcher et quelles décisions prendre avant ce point de bascule.",
    highlights: [
      'Identifier la logique des seuils TVA pour votre activité.',
      "Relier votre rythme d'encaissement à une date de risque.",
      'Voir quelles actions sont possibles avant le dépassement.',
    ],
    sections: [
      {
        title: "Le plafond n'est utile que s'il est relié à votre cadence",
        text:
          "Un seuil sans projection est une information passive. Ce qui aide vraiment un freelance, c'est de voir si le dépassement risque d'arriver dans deux mois ou dans dix.",
      },
      {
        title: 'Le bon arbitrage est souvent commercial autant que fiscal',
        text:
          "Quand un plafond approche, la question devient aussi : faut-il ajuster le prix, le calendrier de facturation ou l'organisation commerciale ?",
      },
      {
        title: 'Pourquoi cette page peut performer en SEO',
        text:
          "Elle cible une intention claire, pratique et moins institutionnelle que calcul urssaf. C'est un meilleur terrain pour battre les résultats génériques.",
      },
    ],
    faq: [
      {
        question: 'Le plafond TVA est-il le même pour toutes les activités ?',
        answer:
          "Non. Les seuils varient selon la nature de l'activité. Il faut donc toujours relier le plafond à votre catégorie micro-entrepreneur.",
      },
      {
        question: 'Pourquoi faut-il agir avant le dépassement ?',
        answer:
          "Parce que l'impact sur les factures, les prix et la lecture du revenu peut être brutal si vous le découvrez trop tard.",
      },
      {
        question: "Que fait NetEnPoche de plus qu'un simple rappel de seuil ?",
        answer:
          'Il relie le seuil à votre trajectoire annuelle et vous aide à comprendre ce que cela change pour votre marge et votre trésorerie.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.tvaThresholds, microSources.urssafStatus],
  },
  {
    slug: 'versement-liberatoire-auto-entrepreneur',
    title: 'Versement libératoire auto-entrepreneur 2026 : faut-il le choisir ?',
    description:
      "Comparez le versement libératoire auto-entrepreneur avec le barème classique et comprenez quand cette option fiscale fait gagner ou perdre.",
    keywords: [
      'versement liberatoire auto entrepreneur',
      'versement liberatoire micro entrepreneur',
      'option versement liberatoire 2026',
      'bareme ou versement liberatoire auto entrepreneur',
      'impot micro entrepreneur versement liberatoire',
    ],
    cardTitle: 'Versement libératoire auto-entrepreneur',
    cardDescription:
      'Une page de décision fiscale pour comparer le versement libératoire au barème classique avec un angle utile et concret.',
    heroEyebrow: 'Choix fiscal',
    heroTitle: 'Versement libératoire auto-entrepreneur : le bon choix dépend de votre situation réelle',
    heroSubtitle:
      "Cette option est souvent présentée comme une simple case à cocher. En pratique, elle n'est intéressante que dans certains cas. Le bon arbitrage demande de comparer avec votre revenu réel.",
    highlights: [
      'Comparer versement libératoire et barème classique.',
      "Voir quand l'option fait gagner ou perdre.",
      'Relier ce choix à votre vrai net annuel plutôt qu’à un taux isolé.',
    ],
    sections: [
      {
        title: "Le versement libératoire n'est pas une bonne idée par défaut",
        text:
          "Il peut simplifier la lecture de l'impôt, mais il n'est pas automatiquement plus avantageux. Tout dépend de votre situation fiscale et de votre niveau de revenu.",
      },
      {
        title: "Ce que veut l'utilisateur, c'est une comparaison utile",
        text:
          "Au lieu de lire une règle abstraite, un micro-entrepreneur veut savoir ce que l'option change concrètement sur l'année : combien il garde, combien il provisionne et quel risque il évite.",
      },
      {
        title: 'Pourquoi ce sujet peut devenir un vrai moteur de conversion',
        text:
          "La personne qui cherche cette requête est déjà dans une logique de choix. C'est une intention plus proche de l'inscription que les requêtes purement informatives.",
      },
    ],
    faq: [
      {
        question: 'Le versement libératoire est-il toujours plus avantageux ?',
        answer:
          "Non. Dans certains cas il simplifie l'impôt et dans d'autres il peut vous coûter plus cher que le barème classique.",
      },
      {
        question: 'Pourquoi faut-il comparer avec le barème classique ?',
        answer:
          "Parce que c'est la seule manière de savoir si l'option change favorablement votre net final ou non.",
      },
      {
        question: 'Que montre NetEnPoche sur ce sujet ?',
        answer:
          'Le produit compare les deux options dans une logique de net, de réserve et de projection annuelle, pas seulement avec une phrase générale.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.versementLiberatoire, microSources.urssafStatus],
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}
