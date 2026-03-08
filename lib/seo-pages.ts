export type SeoLandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingSection = {
  title: string;
  text: string;
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
          'Les resultats Google montrent surtout des outils generalistes URSSAF, parfois orientes employeur ou salarie. Pour un micro-entrepreneur, le bon calcul doit partir du chiffre d affaires, integrer les cotisations sociales, signaler la TVA et replacer le tout dans une logique de revenu net.',
      },
      {
        title: 'Le vrai point de friction, c est le passage du CA au net',
        text:
          'Beaucoup de freelances connaissent leur chiffre d affaires mais pas le montant qu ils pourront reellement conserver. C est la que NetEnPoche se distingue : le produit ne montre pas seulement la charge URSSAF, il relie cotisations, fiscalite et projection annuelle.',
      },
      {
        title: 'Pourquoi cette page existe a cote de la homepage',
        text:
          'La page d accueil vend le produit. Cette page repond d abord a une intention de recherche. Elle sert d entree SEO pour les internautes qui veulent comprendre et calculer avant de s inscrire. C est ce type de ciblage qui peut vous faire remonter sur des requetes concurrentielles sans affronter frontalement urssaf.fr sur son terrain institutionnel.',
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
      'Les auto-entrepreneurs ne cherchent pas seulement un taux. Ils cherchent un simulateur qui relie cotisations sociales, franchise de TVA et revenu final. Cette page repond a cette intention avec un angle clair : comprendre combien vous gardez reellement.',
    highlights: [
      'Faire le lien entre chiffre d affaires encaisse et cotisations a declarer.',
      'Reperer plus tot les seuils de franchise en base de TVA.',
      'Comparer votre net avec ou sans versement liberatoire.',
    ],
    sections: [
      {
        title: 'Le calcul change selon l activite, mais le besoin reste le meme',
        text:
          'Prestations de service, vente, activites mixtes : les bases de calcul ne se lisent pas de la meme facon. En revanche, l objectif du freelance reste identique. Il veut transformer un chiffre d affaires brut en decision simple : combien puis-je garder, payer ou reinvestir ?',
      },
      {
        title: 'La TVA fausse souvent la lecture du revenu',
        text:
          'Tant que la franchise en base n est pas depassee, le calcul semble simple. Mais des qu un seuil approche, le montant encaisse ne reflete plus le revenu reel. Une page SEO orientee auto-entrepreneur doit donc parler de TVA, sinon elle ne couvre qu une partie de l intention utilisateur.',
      },
      {
        title: 'Un simulateur utile doit aussi aider a prioriser',
        text:
          'NetEnPoche ne se limite pas a une reponse unique. Il vous montre les prochains points de vigilance : declaration URSSAF, alertes, evolution annuelle, arbitrage fiscal et comparaison des offres selon la maturite de votre activite.',
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
          'La TVA n entre pas directement dans le calcul des cotisations, mais elle modifie fortement la lecture de votre revenu disponible et de vos factures. C est pourquoi elle doit apparaitre dans un simulateur serieux.',
      },
      {
        question: 'Pourquoi comparer avec et sans versement liberatoire ?',
        answer:
          'Parce que le choix fiscal peut changer le montant final conserve. Pour piloter votre activite, il est utile de voir si cette option vous fait economiser ou non sur l annee.',
      },
    ],
  },
  {
    slug: 'calcul-net-auto-entrepreneur',
    title: 'Calcul net auto-entrepreneur : apres URSSAF, TVA et impot',
    description:
      'Calculez le net auto-entrepreneur apres URSSAF, TVA et impot sur le revenu. Une page pensee pour les independants qui veulent un chiffre exploitable, pas seulement un taux.',
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
      'La plupart des outils s arretent au montant des charges. Cette page cible une intention plus avancee : connaitre le net final apres URSSAF, seuils de TVA et impot sur le revenu. C est exactement le coeur du produit NetEnPoche.',
    highlights: [
      'Passer d un chiffre d affaires mensuel a un net reellement disponible.',
      'Projeter l impact de l impot sur le revenu sur toute l annee fiscale.',
      'Preparer une decision concrete : se verser, epargner, investir ou lisser sa tresorerie.',
    ],
    sections: [
      {
        title: 'Le net percu est la vraie metrique de pilotage',
        text:
          'Un freelance ne pilote pas son activite avec un taux URSSAF seul. Il pilote avec un reste a vivre, une tresorerie et une visibilite sur les prochains paiements. C est pour cela qu une page dediee au calcul net auto-entrepreneur a sa place dans votre architecture SEO.',
      },
      {
        title: 'Le bon message n est pas combien payer, mais combien garder',
        text:
          'Les pages officielles repondent bien aux obligations. Votre avantage produit est ailleurs : transformer une mecanique administrative en lecture financiere simple. Ce positionnement differencie NetEnPoche des pages institutionnelles et des comparateurs trop generalistes.',
      },
      {
        title: 'Une meilleure page SEO doit aussi nourrir la conversion',
        text:
          'Quelqu un qui cherche son net est generalement plus proche de l inscription qu un internaute qui cherche seulement une definition. Cette page permet donc de capter une intention plus qualifiee et de l envoyer vers votre simulateur avec une promesse tres claire.',
      },
    ],
    faq: [
      {
        question: 'Comment estimer son net auto-entrepreneur chaque mois ?',
        answer:
          'Il faut partir du chiffre d affaires encaisse, retirer les cotisations sociales correspondantes, puis projeter l impact de la TVA et de l impot sur le revenu pour eviter un faux sentiment de marge.',
      },
      {
        question: 'Pourquoi le net varie-t-il autant d un mois a l autre ?',
        answer:
          'Parce qu il depend du niveau de chiffre d affaires, de la saisonnalite, de l approche des seuils TVA, du choix fiscal et de la maniere dont vous lissez vos charges sur l annee.',
      },
      {
        question: 'A quoi sert un PDF bilan dans ce contexte ?',
        answer:
          'Un bilan PDF structure permet de transformer vos calculs en document exploitable pour une banque, un bailleur ou un partenaire. C est utile quand vous voulez prouver la solidite de votre activite, pas seulement suivre vos chiffres.',
      },
    ],
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}