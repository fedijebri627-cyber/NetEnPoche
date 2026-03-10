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
    title: 'L essentiel du statut micro-entrepreneur',
    url: 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/lessentiel-du-statut.html',
    publisher: 'URSSAF',
  },
  tvaThresholds: {
    title: 'Franchise en base de TVA : seuils et obligations',
    url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F21746',
    publisher: 'Service-Public.fr',
  },
  versementLiberatoire: {
    title: 'Versement liberatoire de l impot sur le revenu',
    url: 'https://www.impots.gouv.fr/professionnel/le-versement-liberatoire',
    publisher: 'impots.gouv.fr',
  },
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: 'calcul-urssaf',
    title: 'Calcul URSSAF 2026 : cotisations, TVA et net micro-entrepreneur',
    description:
      'Guide et simulateur de calcul URSSAF pour micro-entrepreneurs. Estimez vos cotisations, la TVA et votre vrai net apres charges en 2026.',
    keywords: [
      'calcul urssaf',
      'calcule urssaf',
      'simulateur urssaf',
      'cotisations urssaf micro entrepreneur',
      'calcul charges urssaf',
    ],
    cardTitle: 'Calcul URSSAF 2026',
    cardDescription:
      'Une page dediee a la requete la plus large, recentree sur les cotisations, la TVA et le vrai net du micro-entrepreneur.',
    heroEyebrow: 'Guide micro-entrepreneur 2026',
    heroTitle: 'Calcul URSSAF : combien vous reste-t-il vraiment apres cotisations ?',
    heroSubtitle:
      'Quand quelqu un cherche "calcule urssaf", il veut rarement un tableau theorique. Il veut connaitre ses cotisations, son seuil de TVA et ce qu il garde reellement. NetEnPoche regroupe ces trois reponses dans la meme simulation.',
    highlights: [
      'Estimer rapidement les cotisations URSSAF a partir du chiffre d affaires declare.',
      'Visualiser le moment ou la TVA commence a peser sur votre rentabilite.',
      'Projeter votre net apres impot pour eviter les mauvaises surprises en fin d annee.',
    ],
    sections: [
      {
        title: 'Un calcul URSSAF utile ne s arrete pas aux cotisations',
        text:
          'Les resultats Google montrent souvent des outils generalistes URSSAF, parfois orientes employeur ou salarie. Pour un micro-entrepreneur, le bon calcul doit partir du chiffre d affaires, integrer les cotisations sociales, signaler la TVA et replacer le tout dans une logique de revenu net.',
      },
      {
        title: 'Le vrai point de friction, c est le passage du CA au net',
        text:
          'Beaucoup de freelances connaissent leur chiffre d affaires mais pas le montant qu ils pourront reellement conserver. C est la que NetEnPoche se distingue : le produit ne montre pas seulement la charge URSSAF, il relie cotisations, fiscalite et projection annuelle.',
      },
      {
        title: 'Pourquoi cette page existe a cote de la homepage',
        text:
          'La page d accueil vend le produit. Cette page repond d abord a une intention de recherche. Elle sert d entree SEO pour les internautes qui veulent comprendre et calculer avant de s inscrire.',
      },
    ],
    faq: [
      {
        question: 'Comment calculer ses cotisations URSSAF en micro-entreprise ?',
        answer:
          'Le calcul part du chiffre d affaires encaisse, auquel on applique le taux correspondant a votre activite. Mais pour piloter votre activite, il faut aller plus loin et relier ce montant au seuil de TVA et a l impot sur le revenu.',
      },
      {
        question: 'Pourquoi le resultat URSSAF ne suffit-il pas a connaitre son vrai net ?',
        answer:
          'Parce que les cotisations sociales ne sont qu une partie de l equation. Un micro-entrepreneur doit aussi surveiller la TVA, anticiper l impot et comparer ces montants a son chiffre d affaires pour mesurer sa marge reelle.',
      },
      {
        question: 'NetEnPoche remplace-t-il le site officiel de l URSSAF ?',
        answer:
          'Non. Le site officiel reste la reference pour les obligations declaratives. NetEnPoche sert a mieux comprendre, anticiper et visualiser l impact financier avant de declarer.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'calcul-urssaf-auto-entrepreneur',
    title: 'Calcul URSSAF auto-entrepreneur : cotisations et TVA en 2026',
    description:
      'Calculez vos cotisations URSSAF auto-entrepreneur, surveillez la TVA et estimez votre revenu disponible avec un simulateur pense pour les freelances francais.',
    keywords: [
      'calcul urssaf auto entrepreneur',
      'simulateur urssaf auto entrepreneur',
      'cotisations auto entrepreneur',
      'micro entrepreneur urssaf calcul',
      'charges auto entrepreneur 2026',
    ],
    cardTitle: 'Calcul URSSAF auto-entrepreneur',
    cardDescription:
      'Une page plus ciblee pour les auto-entrepreneurs qui veulent estimer leurs charges et comprendre l impact TVA plus impot.',
    heroEyebrow: 'Auto-entrepreneur',
    heroTitle: 'Calcul URSSAF auto-entrepreneur : du chiffre d affaires au revenu disponible',
    heroSubtitle:
      'Les auto-entrepreneurs ne cherchent pas seulement un taux. Ils cherchent un simulateur qui relie cotisations sociales, franchise de TVA et revenu final.',
    highlights: [
      'Faire le lien entre chiffre d affaires encaisse et cotisations a declarer.',
      'Reperer plus tot les seuils de franchise en base de TVA.',
      'Comparer votre net avec ou sans versement liberatoire.',
    ],
    sections: [
      {
        title: 'Le calcul change selon l activite, mais le besoin reste le meme',
        text:
          'Prestations de service, vente, activites mixtes : les bases de calcul ne se lisent pas de la meme facon. En revanche, l objectif du freelance reste identique. Il veut transformer un chiffre d affaires brut en decision simple.',
      },
      {
        title: 'La TVA fausse souvent la lecture du revenu',
        text:
          'Tant que la franchise en base n est pas depassee, le calcul semble simple. Mais des qu un seuil approche, le montant encaisse ne reflete plus le revenu reel.',
      },
      {
        title: 'Un simulateur utile doit aussi aider a prioriser',
        text:
          'NetEnPoche ne se limite pas a une reponse unique. Il montre les prochains points de vigilance : declaration URSSAF, alertes, evolution annuelle et arbitrage fiscal.',
      },
    ],
    faq: [
      {
        question: 'Quelle est la difference entre chiffre d affaires et net auto-entrepreneur ?',
        answer:
          'Le chiffre d affaires correspond a ce que vous encaissez. Le net correspond a ce qu il reste apres cotisations sociales, eventuellement TVA, puis impot sur le revenu selon votre situation.',
      },
      {
        question: 'Faut-il inclure la TVA dans un calcul URSSAF auto-entrepreneur ?',
        answer:
          'La TVA n entre pas directement dans le calcul des cotisations, mais elle modifie fortement la lecture de votre revenu disponible et de vos factures.',
      },
      {
        question: 'Pourquoi comparer avec et sans versement liberatoire ?',
        answer:
          'Parce que le choix fiscal peut changer le montant final conserve. Il est utile de voir si cette option vous fait economiser ou non sur l annee.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'calcul-net-auto-entrepreneur',
    title: 'Calcul net auto-entrepreneur : apres URSSAF, TVA et impot',
    description:
      'Calculez le net auto-entrepreneur apres URSSAF, TVA et impot sur le revenu. Une page pensee pour les independants qui veulent un chiffre exploitable.',
    keywords: [
      'calcul net auto entrepreneur',
      'net auto entrepreneur apres charges',
      'revenu net micro entrepreneur',
      'simulateur net auto entrepreneur',
      'urssaf net micro entrepreneur',
    ],
    cardTitle: 'Calcul net auto-entrepreneur',
    cardDescription:
      'Une entree SEO pour les personnes qui ne cherchent pas un taux de cotisation, mais le revenu net reel apres URSSAF et impot.',
    heroEyebrow: 'Vrai net',
    heroTitle: 'Calcul net auto-entrepreneur : le chiffre qui compte vraiment',
    heroSubtitle:
      'La plupart des outils s arretent au montant des charges. Cette page cible une intention plus avancee : connaitre le net final apres URSSAF, seuils de TVA et impot sur le revenu.',
    highlights: [
      'Passer d un chiffre d affaires mensuel a un net reellement disponible.',
      'Projeter l impact de l impot sur le revenu sur toute l annee fiscale.',
      'Preparer une decision concrete : se verser, epargner, investir ou lisser sa tresorerie.',
    ],
    sections: [
      {
        title: 'Le net percu est la vraie metrique de pilotage',
        text:
          'Un freelance ne pilote pas son activite avec un taux URSSAF seul. Il pilote avec un reste a vivre, une tresorerie et une visibilite sur les prochains paiements.',
      },
      {
        title: 'Le bon message n est pas combien payer, mais combien garder',
        text:
          'Les pages officielles repondent bien aux obligations. Votre avantage produit est ailleurs : transformer une mecanique administrative en lecture financiere simple.',
      },
      {
        title: 'Une meilleure page SEO doit aussi nourrir la conversion',
        text:
          'Quelqu un qui cherche son net est generalement plus proche de l inscription qu un internaute qui cherche seulement une definition.',
      },
    ],
    faq: [
      {
        question: 'Comment estimer son net auto-entrepreneur chaque mois ?',
        answer:
          'Il faut partir du chiffre d affaires encaisse, retirer les cotisations sociales correspondantes, puis projeter l impact de la TVA et de l impot sur le revenu.',
      },
      {
        question: 'Pourquoi le net varie-t-il autant d un mois a l autre ?',
        answer:
          'Parce qu il depend du niveau de chiffre d affaires, de la saisonnalite, de l approche des seuils TVA, du choix fiscal et de la maniere dont vous lissez vos charges.',
      },
      {
        question: 'A quoi sert un PDF bilan dans ce contexte ?',
        answer:
          'Un bilan PDF structure permet de transformer vos calculs en document exploitable pour une banque, un bailleur ou un partenaire.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.urssafStatus, microSources.tvaThresholds, microSources.versementLiberatoire],
  },
  {
    slug: 'tva-micro-entreprise',
    title: 'TVA micro-entreprise 2026 : seuils, franchise et vrai impact sur votre net',
    description:
      'Comprenez la TVA en micro-entreprise : franchise en base, seuils, depassement et impact sur votre revenu reel en 2026.',
    keywords: [
      'tva micro entreprise',
      'franchise en base tva micro entreprise',
      'seuil tva micro entrepreneur',
      'tva auto entrepreneur 2026',
      'depassement tva micro entreprise',
    ],
    cardTitle: 'TVA micro-entreprise',
    cardDescription:
      'Une page pour les freelances qui approchent les seuils de TVA et veulent comprendre ce que cela change concretement.',
    heroEyebrow: 'TVA et seuils',
    heroTitle: 'TVA micro-entreprise : le moment ou votre CA ne raconte plus toute l histoire',
    heroSubtitle:
      'Le sujet n est pas seulement de savoir si vous etes encore en franchise de TVA. Le vrai enjeu est de comprendre a partir de quel moment votre revenu disponible et vos factures changent.',
    highlights: [
      'Voir les seuils de franchise en base par activite.',
      'Comprendre ce qui change quand un seuil est depasse.',
      'Relier la TVA a votre net, pas seulement a une obligation administrative.',
    ],
    sections: [
      {
        title: 'La TVA micro-entreprise est d abord un sujet de pilotage',
        text:
          'Beaucoup d independants regardent la TVA comme une formalite. En realite, c est un point de bascule sur vos prix, votre marge et votre facon de presenter vos factures.',
      },
      {
        title: 'Le depassement des seuils est souvent ressenti trop tard',
        text:
          'Le risque n est pas seulement de depasser un chiffre. Le risque est de continuer a lire son activite comme si tout ce qui etait encaisse pouvait etre garde.',
      },
      {
        title: 'Pourquoi cette page est SEO-strategique',
        text:
          'La requete TVA micro-entreprise est plus specifique et plus accessible que calcul urssaf. Elle attire une audience qui a deja un vrai probleme a resoudre.',
      },
    ],
    faq: [
      {
        question: 'Qu est-ce que la franchise en base de TVA ?',
        answer:
          'C est le regime qui permet a une micro-entreprise de ne pas facturer la TVA tant que certains seuils de chiffre d affaires ne sont pas depasses.',
      },
      {
        question: 'Pourquoi la TVA change-t-elle mon vrai net ?',
        answer:
          'Parce qu une partie de ce que vous facturez n est plus un revenu garde. Sans lecture claire, vous pouvez surestimer votre marge disponible.',
      },
      {
        question: 'Pourquoi suivre la TVA dans NetEnPoche ?',
        answer:
          'Parce que le suivi du seuil vous aide a anticiper plutot qu a subir. Le bon moment pour agir se voit avant le depassement, pas apres.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.tvaThresholds, microSources.urssafStatus],
  },
  {
    slug: 'plafond-tva-auto-entrepreneur',
    title: 'Plafond TVA auto-entrepreneur 2026 : quand agir avant le depassement',
    description:
      'Surveillez le plafond TVA auto-entrepreneur, comprenez les seuils et anticipez leur impact sur vos factures, votre marge et votre rythme de croissance.',
    keywords: [
      'plafond tva auto entrepreneur',
      'seuil tva auto entrepreneur 2026',
      'quand facturer la tva auto entrepreneur',
      'depassement plafond tva micro entrepreneur',
      'franchise tva auto entrepreneur',
    ],
    cardTitle: 'Plafond TVA auto-entrepreneur',
    cardDescription:
      'Une page centree sur le moment ou les seuils TVA approchent et sur ce qu il faut faire avant d etre rattrape.',
    heroEyebrow: 'Seuils TVA',
    heroTitle: 'Plafond TVA auto-entrepreneur : comment voir venir le changement avant qu il arrive',
    heroSubtitle:
      'Le bon reflexe n est pas seulement de connaitre un plafond. C est de savoir a quel rythme vous allez l approcher et quelles decisions prendre avant ce point de bascule.',
    highlights: [
      'Identifier la logique des seuils TVA pour votre activite.',
      'Relier votre rythme d encaissement a une date de risque.',
      'Voir quelles actions sont possibles avant le depassement.',
    ],
    sections: [
      {
        title: 'Le plafond n est utile que s il est relie a votre cadence',
        text:
          'Un seuil sans projection est une information passive. Ce qui aide vraiment un freelance, c est de voir si le depassement risque d arriver dans deux mois ou dans dix.',
      },
      {
        title: 'Le bon arbitrage est souvent commercial autant que fiscal',
        text:
          'Quand un plafond approche, la question devient aussi : faut-il ajuster le prix, le calendrier de facturation ou l organisation commerciale ?',
      },
      {
        title: 'Pourquoi cette page peut performer en SEO',
        text:
          'Elle cible une intention claire, pratique et moins institutionnelle que calcul urssaf. C est un meilleur terrain pour battre les resultats generiques.',
      },
    ],
    faq: [
      {
        question: 'Le plafond TVA est-il le meme pour toutes les activites ?',
        answer:
          'Non. Les seuils varient selon la nature de l activite. Il faut donc toujours relier le plafond a votre categorie micro-entrepreneur.',
      },
      {
        question: 'Pourquoi faut-il agir avant le depassement ?',
        answer:
          'Parce que l impact sur les factures, les prix et la lecture du revenu peut etre brutal si vous le decouvrez trop tard.',
      },
      {
        question: 'Que fait NetEnPoche de plus qu un simple rappel de seuil ?',
        answer:
          'Il relie le seuil a votre trajectoire annuelle et vous aide a comprendre ce que cela change pour votre marge et votre tresorerie.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.tvaThresholds, microSources.urssafStatus],
  },
  {
    slug: 'versement-liberatoire-auto-entrepreneur',
    title: 'Versement liberatoire auto-entrepreneur 2026 : faut-il le choisir ?',
    description:
      'Comparez le versement liberatoire auto-entrepreneur avec le bareme classique et comprenez quand cette option fiscale fait gagner ou perdre.',
    keywords: [
      'versement liberatoire auto entrepreneur',
      'versement liberatoire micro entrepreneur',
      'option versement liberatoire 2026',
      'bareme ou versement liberatoire auto entrepreneur',
      'impot micro entrepreneur versement liberatoire',
    ],
    cardTitle: 'Versement liberatoire auto-entrepreneur',
    cardDescription:
      'Une page de decision fiscale pour comparer le versement liberatoire au bareme classique avec un angle utile et concret.',
    heroEyebrow: 'Choix fiscal',
    heroTitle: 'Versement liberatoire auto-entrepreneur : le bon choix depend de votre situation reelle',
    heroSubtitle:
      'Cette option est souvent presentee comme une simple case a cocher. En pratique, elle n est interessante que dans certains cas. Le bon arbitrage demande de comparer avec votre revenu reel.',
    highlights: [
      'Comparer versement liberatoire et bareme classique.',
      'Voir quand l option fait gagner ou perdre.',
      'Relier ce choix a votre vrai net annuel plutot qu a un taux isole.',
    ],
    sections: [
      {
        title: 'Le versement liberatoire n est pas une bonne idee par defaut',
        text:
          'Il peut simplifier la lecture de l impot, mais il n est pas automatiquement plus avantageux. Tout depend de votre situation fiscale et de votre niveau de revenu.',
      },
      {
        title: 'Ce que veut l utilisateur, c est une comparaison utile',
        text:
          'Au lieu de lire une regle abstraite, un micro-entrepreneur veut savoir ce que l option change concretement sur l annee : combien il garde, combien il provisionne et quel risque il evite.',
      },
      {
        title: 'Pourquoi ce sujet peut devenir un vrai moteur de conversion',
        text:
          'La personne qui cherche cette requete est deja dans une logique de choix. C est une intention plus proche de l inscription que les requetes purement informatives.',
      },
    ],
    faq: [
      {
        question: 'Le versement liberatoire est-il toujours plus avantageux ?',
        answer:
          'Non. Dans certains cas il simplifie l impot et dans d autres il peut vous couter plus cher que le bareme classique.',
      },
      {
        question: 'Pourquoi faut-il comparer avec le bareme classique ?',
        answer:
          'Parce que c est la seule maniere de savoir si l option change favorablement votre net final ou non.',
      },
      {
        question: 'Que montre NetEnPoche sur ce sujet ?',
        answer:
          'Le produit compare les deux options dans une logique de net, de reserve et de projection annuelle, pas seulement avec une phrase generale.',
      },
    ],
    updatedAt: '2026-03-10',
    officialSources: [microSources.versementLiberatoire, microSources.urssafStatus],
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}
