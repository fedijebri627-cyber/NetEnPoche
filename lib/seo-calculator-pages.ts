export type SeoCalculatorFaq = {
  question: string;
  answer: string;
};

export type SeoCalculatorSource = {
  title: string;
  url: string;
  publisher: string;
};

export type SeoCalculatorSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type SeoCalculatorExample = {
  title: string;
  summary: string;
  values: Array<{ label: string; value: string }>;
};

export type SeoCalculatorPage = {
  slug: string;
  variant: 'brut-net' | 'freelance-vs-salarie' | 'tjm';
  title: string;
  description: string;
  keywords: string[];
  cardTitle: string;
  cardDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedAt: string;
  updateNote: string;
  introPoints: string[];
  sections: SeoCalculatorSection[];
  faq: SeoCalculatorFaq[];
  examples?: SeoCalculatorExample[];
  officialSources: SeoCalculatorSource[];
};

const officialSources = {
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

export const seoCalculatorPages: SeoCalculatorPage[] = [
  {
    slug: 'simulateur-brut-net-auto-entrepreneur',
    variant: 'brut-net',
    title: 'Simulateur Brut Net Auto-Entrepreneur 2026 — Calcul Instantané',
    description:
      'Convertissez votre CA en net réel et comparez-le à un salaire salarié équivalent. URSSAF, TVA et impôts inclus. Gratuit et sans inscription.',
    keywords: [
      'brut net auto-entrepreneur',
      'simulateur brut net auto-entrepreneur',
      'salaire brut net micro-entreprise',
      'equivalent salaire auto-entrepreneur',
      'convertir ca en salaire net',
    ],
    cardTitle: 'Brut net auto-entrepreneur',
    cardDescription:
      'Convertissez votre chiffre d’affaires en vrai net freelance et comparez-le à un salarié sans créer de compte.',
    heroEyebrow: 'Simulateur freelance 2026',
    heroTitle: 'Simulateur Brut Net Auto-Entrepreneur : votre vrai net après URSSAF et impôt',
    heroSubtitle:
      'Entrez votre CA mensuel et voyez exactement ce que vous gardez après URSSAF et impôt, puis à quel salaire cela correspond vraiment côté salarié.',
    updatedAt: '2026-03-11',
    updateNote: 'Mis à jour le 11 mars 2026 — calcul brut/net revu pour les taux micro-entrepreneur 2026.',
    introPoints: [
      'Calculez votre net freelance sans jargon ni écran de connexion.',
      'Comparez votre résultat à un salaire salarié pour rendre la réponse parlante.',
      'Visualisez le poids réel de l’URSSAF, de l’impôt et de la TVA dès le premier écran.',
    ],
    examples: [
      {
        title: 'Développeur web — 6 000 € / mois',
        summary: 'Le profil qui veut savoir si un CA solide se traduit vraiment par un revenu supérieur à un CDI.',
        values: [
          { label: 'Net freelance après impôt', value: '≈ 4 300 € / mois' },
          { label: 'Salaire brut équivalent', value: '≈ 5 550 € / mois' },
          { label: 'Point de vigilance', value: 'TVA à surveiller sur le rythme annuel' },
        ],
      },
      {
        title: 'Consultante RH — 4 000 € / mois',
        summary: 'Un cas typique où la lecture du net et la comparaison salarié rassurent avant de signer une mission longue.',
        values: [
          { label: 'Net freelance après impôt', value: '≈ 2 850 € / mois' },
          { label: 'Réserve conseillée', value: '≈ 1 000 € / mois' },
          { label: 'Lecture utile', value: 'vrai net > simple chiffre encaissé' },
        ],
      },
      {
        title: 'Graphiste — 3 000 € / mois',
        summary: 'Le type de revenu où chaque oubli de charge ou de fiscalité crée une mauvaise surprise en fin d’année.',
        values: [
          { label: 'Net freelance après impôt', value: '≈ 2 150 € / mois' },
          { label: 'Équivalent salarié', value: '≈ 2 775 € brut / mois' },
          { label: 'Point clé', value: 'ne pas oublier la provision CFE' },
        ],
      },
    ],
    sections: [
      {
        title: 'Comment fonctionne le calcul brut net en auto-entreprise',
        paragraphs: [
          "Le calcul pertinent ne consiste pas à prendre un taux URSSAF et à le soustraire du chiffre d’affaires. En micro-entreprise, le revenu réellement disponible dépend d’au moins quatre couches : les cotisations sociales, l’impôt sur le revenu, la franchise de TVA et les charges de structure à provisionner comme la CFE. Quand un visiteur tape 'brut net auto-entrepreneur', il cherche une réponse exploitable immédiatement, pas une règle isolée à interpréter ensuite seul.",
          "Sur cette page, NetEnPoche part d’un chiffre d’affaires mensuel hors taxes, l’annualise, applique les taux de cotisations correspondant à votre activité, calcule l’impôt selon le foyer fiscal choisi puis traduit le résultat en revenu mensuel lisible. Le simulateur garde aussi un œil sur la TVA, car un freelance peut croire qu’il gagne plus simplement parce qu’il regarde l’encaissement brut au lieu de son vrai disponible.",
          "Le résultat utile n’est donc pas seulement 'combien je paie', mais 'combien il me reste une fois tout aligné'. C’est précisément cette différence qui sépare un outil pédagogique d’un outil de pilotage."
        ],
      },
      {
        title: 'Brut net auto-entrepreneur : lire les résultats face à un salarié',
        paragraphs: [
          "Comparer un CA freelance à un salaire brut sans méthode mène presque toujours à une mauvaise décision. Le salarié voit un brut mensuel, puis un net avant impôt ou après impôt selon la fiche de paie. Le micro-entrepreneur voit surtout un chiffre d’affaires encaissé, auquel il doit mentalement retirer plusieurs couches. Les deux réalités ne parlent donc pas la même langue au départ.",
          "Le bon réflexe consiste à comparer deux chiffres interprétables : d’un côté le net freelance après URSSAF et impôt, de l’autre le net salarié sur une base cohérente. À partir de là, on peut remonter à un salaire brut équivalent. Cette traduction est très utile pour un indépendant qui veut négocier, benchmarker une proposition de CDI ou simplement répondre à la question que lui posent ses proches : 'oui, mais ça fait combien en vrai par rapport à un salaire ?'",
          "Cette page répond justement à cette question sans forcer l’utilisateur à connaître le détail des barèmes. La mécanique est visible, mais le message final reste compréhensible."
        ],
        bullets: [
          'Le CA n’est pas un salaire : c’est une base de calcul.',
          'Le net freelance a besoin d’une réserve pour URSSAF, impôt et parfois CFE.',
          'Le salarié a des charges intégrées à la fiche de paie ; le freelance doit les piloter lui-même.',
        ],
      },
      {
        title: 'À quel CA le freelance devient plus rentable qu’un CDI ?',
        paragraphs: [
          "Il n’existe pas une réponse unique valable pour tous. La bascule dépend du type d’activité, du foyer fiscal, du niveau de dépenses personnelles et du rythme de chiffre d’affaires sur l’année. En revanche, il existe une méthode simple : prendre un salaire de référence, calculer son net, puis chercher le niveau de CA à partir duquel le net freelance après charges devient supérieur. C’est exactement ce que la comparaison intégrée permet d’explorer rapidement.",
          "Dans la pratique, beaucoup d’indépendants découvrent que la sensation de 'mieux gagner sa vie' arrive trop tôt parce qu’ils comparent leur CA à un net salarié. Le simulateur évite ce piège : il compare des bases homogènes. Il permet aussi de voir si la marge gagnée vaut réellement le risque supplémentaire, la gestion administrative et l’absence de congés payés.",
          "Autrement dit, le bon seuil n’est pas seulement financier. C’est le niveau où votre revenu disponible, votre stabilité commerciale et votre capacité à provisionner deviennent suffisamment lisibles."
        ],
        table: {
          headers: ['Objectif', 'Repère utile'],
          rows: [
            ['Rester comparable à un CDI', 'Chercher un CA qui dépasse le net salarié après toutes les charges freelance'],
            ['Négocier une mission', 'Utiliser le salaire brut équivalent comme base de comparaison'],
            ['Préparer une transition', 'Tester plusieurs niveaux de CA mensuel avant de quitter un poste'],
          ],
        },
      },
      {
        title: 'Les charges à ne pas oublier quand vous raisonnez en brut net',
        paragraphs: [
          "Le premier oubli classique concerne la CFE. Même si son montant n’est pas toujours ressenti mensuellement, elle grignote le net réel et doit être provisionnée. Le deuxième oubli concerne la TVA : tant que la franchise tient, l’illusion d’un revenu simple est forte ; lorsqu’un seuil approche, le chiffre encaissé devient beaucoup moins lisible. Enfin, l’impôt sur le revenu est souvent sous-estimé lorsque l’on compare uniquement le net après URSSAF.",
          "À cela s’ajoutent des charges non incluses dans la micro-entreprise au sens strict : mutuelle, prévoyance, congés non facturés, matériel, formation, prospection et jours creux. Ces postes n’entrent pas tous dans le simulateur principal, mais ils doivent être présents dans votre lecture business. C’est pourquoi la page ne promet pas 'la vérité universelle', mais une lecture honnête, comparable et activable.",
          "En résumé, le bon simulateur brut net freelance n’est pas celui qui simplifie à outrance. C’est celui qui vous donne un chiffre clair tout en rappelant ce qu’il faut continuer à piloter derrière."
        ],
      },
      {
        title: 'Pourquoi cette page peut mieux répondre que les calculateurs salariés',
        paragraphs: [
          "Les sites très bien placés sur les requêtes de type 'brut en net' sont souvent excellents… pour les salariés. Leur promesse, leur structure et leurs backlinks sont construits autour d’une fiche de paie. Cela leur donne une autorité forte sur ce sujet, mais une faiblesse dès que l’internaute veut comparer un chiffre d’affaires freelance à un revenu salarié comparable.",
          "NetEnPoche n’essaie pas de battre ces outils sur leur terrain historique. Le bon angle est adjacent : brut net auto-entrepreneur, équivalent salaire freelance, convertir un CA en net réel. Sur ces questions, un site spécialisé pour micro-entrepreneurs a naturellement plus de légitimité à condition de proposer un calcul visible, un contenu clair et une vraie suite après le clic.",
          "C’est aussi la raison du CTA vers le compte gratuit. L’objectif n’est pas seulement de répondre une fois. L’objectif est d’aider l’utilisateur à suivre ce calcul tous les mois sans repartir de zéro."
        ],
      },
    ],
    faq: [
      {
        question: 'Comment passer de mon chiffre d’affaires à un vrai net freelance ?',
        answer:
          'Il faut retirer les cotisations URSSAF, estimer l’impôt sur le revenu puis garder une provision pour les charges de structure comme la CFE. Le simple chiffre encaissé ne suffit pas.',
      },
      {
        question: 'Pourquoi comparer mon net freelance à un salaire ?',
        answer:
          'Parce que cette traduction rend votre revenu lisible. Elle vous aide à benchmarker une mission, discuter d’une transition CDI vers freelance ou simplement mesurer votre niveau réel de rémunération.',
      },
      {
        question: 'Le simulateur inclut-il la TVA ?',
        answer:
          'Il suit l’exposition à la TVA et rappelle quand le seuil commence à devenir un vrai sujet. La TVA ne change pas le calcul URSSAF direct, mais elle change fortement la lecture du revenu disponible.',
      },
      {
        question: 'Le versement libératoire change-t-il beaucoup le résultat ?',
        answer:
          'Cela dépend du foyer fiscal et du niveau de revenu. Sur certains profils il simplifie la lecture, sur d’autres il coûte plus cher que le barème classique.',
      },
      {
        question: 'Puis-je utiliser cette page sans créer de compte ?',
        answer:
          'Oui. Le simulateur est public et fonctionne sans inscription. Le compte gratuit sert ensuite à suivre les mêmes calculs chaque mois.',
      },
      {
        question: 'Pourquoi le net après URSSAF n’est-il pas le vrai net final ?',
        answer:
          'Parce que l’impôt et certaines provisions restent à intégrer. Le net après URSSAF donne un premier repère, pas la lecture finale la plus prudente.',
      },
      {
        question: 'Le résultat remplace-t-il une déclaration officielle ?',
        answer:
          'Non. Les obligations déclaratives se font toujours auprès des services officiels. Cette page sert à comprendre et anticiper, pas à déclarer.',
      },
      {
        question: 'Quel est le meilleur usage de ce simulateur ?',
        answer:
          'Tester plusieurs niveaux de CA, comparer avec une situation salariée et identifier le niveau de revenu qui reste réellement disponible chaque mois.',
      },
    ],
    officialSources: [officialSources.urssafStatus, officialSources.tvaThresholds, officialSources.versementLiberatoire],
  },
  {
    slug: 'freelance-vs-salarie',
    variant: 'freelance-vs-salarie',
    title: 'Freelance vs Salarié 2026 : Comparatif de Revenu Net',
    description:
      'Calculez à partir de quel CA votre activité en micro-entreprise devient plus rentable qu’un emploi salarié. Comparatif complet avec exemples.',
    keywords: [
      'freelance vs salarié salaire',
      'combien gagner freelance vs salarié',
      'micro-entrepreneur vs cdi revenu',
      'equivalent salaire freelance',
      'freelance ou salarié revenu net',
    ],
    cardTitle: 'Freelance vs salarié',
    cardDescription:
      'Un comparatif net contre net pour savoir à partir de quel chiffre d’affaires le freelance devient plus rentable.',
    heroEyebrow: 'Comparatif de revenu 2026',
    heroTitle: 'Freelance ou salarié : lequel vous laisse vraiment le plus à la fin du mois ?',
    heroSubtitle:
      'Cette page prend les deux points de départ les plus fréquents — un salaire brut mensuel et un chiffre d’affaires freelance — puis les traduit dans la même langue : le revenu net. Vous voyez ensuite le point d’équilibre où le freelance passe devant.',
    updatedAt: '2026-03-11',
    updateNote: 'Mis à jour le 11 mars 2026 — coefficients salarié et barème fiscal 2026 actualisés.',
    introPoints: [
      'Comparez le net salarié au net freelance sur le même écran.',
      'Repérez le CA à partir duquel l’indépendance devient réellement plus rentable.',
      'Lisez les avantages et les angles morts de chaque statut avec des exemples concrets.',
    ],
    sections: [
      {
        title: 'Freelance vs salarié : comment interpréter la comparaison',
        paragraphs: [
          "Beaucoup de comparatifs rapides opposent un salaire net à un chiffre d’affaires freelance. C’est le raccourci le plus fréquent et aussi le plus trompeur. Le salarié voit un revenu déjà filtré par la mécanique de la paie. Le freelance voit un montant encaissé qui reste à transformer. Tant que cette traduction n’est pas faite correctement, la comparaison donne un faux sentiment de supériorité ou de perte selon le cas.",
          "Le bon comparatif part donc de deux bases lisibles : un salaire brut transformé en net salarié d’un côté, un CA transformé en net freelance après URSSAF, impôt et provision CFE de l’autre. À ce moment seulement, on peut parler de différence mensuelle réelle. C’est la logique de cette page : sortir du débat théorique pour revenir à ce que vous pouvez vraiment garder.",
          "Ce cadrage est particulièrement utile pour une personne qui hésite entre rester salariée, accepter un portage, ou se lancer en micro-entreprise. Il évite les décisions prises sur un chiffre flatteur mais incomplet."
        ],
      },
      {
        title: 'Ce que le salaire brut ne dit pas',
        paragraphs: [
          "Le salaire brut donne une idée de votre niveau de rémunération, mais il ne raconte pas tout le cadre de protection qui va avec : cotisations sociales, congés payés, mutuelle employeur, éventuelle stabilité de mission et rythme de versement fixe. En pratique, deux revenus nets proches peuvent produire des ressentis très différents si l’un inclut plus de sécurité et moins d’administration.",
          "Quand vous comparez un brut salarié à un CA freelance, il faut donc distinguer deux choses : le revenu mensuel disponible et l’environnement qui l’accompagne. La page répond surtout à la première question, parce qu’elle est calculable immédiatement. Mais les sections suivantes remettent aussi en place ce que le chiffre seul ne dit pas pour éviter une conclusion trop rapide.",
          "Autrement dit, si le freelance gagne 300 € de plus par mois mais doit absorber davantage d’incertitude, la décision n’est pas purement mathématique. Elle est plus large."
        ],
      },
      {
        title: 'Ce que le CA freelance ne dit pas',
        paragraphs: [
          "Le chiffre d’affaires freelance cache plusieurs angles morts : jours non facturés, prospection, matériel, vacances non payées, trous de mission, et parfois TVA mal anticipée. Un CA de 6 000 € n’a donc de sens qu’une fois transformé en net réel et remis dans un rythme annuel cohérent.",
          "C’est justement pour cela que le point d’équilibre calculé ici est utile : il ne se contente pas de dire 'le freelance peut gagner plus'. Il dit à partir de quel niveau de CA vous passez devant en net comparable, avec la mécanique fiscale et sociale actuelle. Le résultat n’est pas parfait dans l’absolu, mais il est bien plus robuste qu’un simple ratio pris à la louche.",
          "Un bon comparatif freelance vs salarié doit donc être à la fois chiffré et honnête. Il doit montrer le différentiel, mais aussi rappeler ce qui n’est pas inclus dans ce différentiel."
        ],
      },
      {
        title: 'Le tableau de bord utile par tranche de revenu',
        paragraphs: [
          "Le but d’un comparatif n’est pas seulement d’avoir un cas personnel. Il est aussi de donner des repères. Le tableau ci-dessous aide à visualiser comment évolue le rapport entre CA freelance, net réellement disponible et salaire brut comparable quand on monte en revenus. Ce type de grille est précieux pour se projeter, préparer une hausse de TJM ou décider si un passage en indépendant a du sens à court terme.",
          "Il faut bien lire ces montants comme des repères de simulation, pas comme une promesse universelle. Le foyer fiscal, la présence de versement libératoire ou une activité de vente plutôt que de service peuvent déplacer la courbe. Mais la logique reste la même : à mesure que vous montez en CA, votre marge de manœuvre augmente, à condition de garder une discipline de provision et de ne pas subir la TVA par surprise."
        ],
        table: {
          headers: ['CA freelance / mois', 'Net freelance estimé', 'Salaire brut comparable'],
          rows: [
            ['2 000 €', '≈ 1 350 €', '≈ 1 740 €'],
            ['3 000 €', '≈ 2 050 €', '≈ 2 640 €'],
            ['4 000 €', '≈ 2 750 €', '≈ 3 550 €'],
            ['5 000 €', '≈ 3 450 €', '≈ 4 450 €'],
            ['6 000 €', '≈ 4 150 €', '≈ 5 360 €'],
            ['8 000 €', '≈ 5 600 €', '≈ 7 230 €'],
            ['10 000 €', '≈ 7 000 €', '≈ 9 030 €'],
          ],
        },
      },
      {
        title: 'Quand partir en freelance est une mauvaise idée financièrement',
        paragraphs: [
          "Il existe des cas où le freelance est objectivement moins intéressant à court terme. C’est souvent le cas si votre CA prévisible est trop irrégulier, si vous dépendez d’un seul client, si votre taux journalier n’est pas assez haut pour couvrir les jours non facturés ou si votre foyer fiscal rend le différentiel trop faible. Dans ce cas, l’indépendance n’est pas forcément une erreur, mais le timing peut l’être.",
          "Il faut aussi être prudent lorsque l’on se compare à un CDI qui inclut des avantages implicites importants : primes, participation, mutuelle avantageuse, matériel, ou vraie protection en cas de trou d’activité. Un comparatif sérieux doit pouvoir conclure que le salariat reste préférable si le différentiel ne compense pas ces éléments.",
          "La bonne décision n’est donc pas 'le freelance gagne toujours plus'. La bonne décision est 'je sais à partir de quel niveau cela devient plus intéressant pour moi, et ce niveau est atteint ou non'."
        ],
      },
    ],
    faq: [
      {
        question: 'Comment comparer proprement un salaire et un chiffre d’affaires freelance ?',
        answer:
          'Il faut convertir les deux en net mensuel comparable. Un brut salarié doit être ramené à un net salarié ; un CA freelance doit être ramené à un net après URSSAF, impôt et provision CFE.',
      },
      {
        question: 'Le freelance gagne-t-il toujours plus qu’un salarié ?',
        answer:
          'Non. Tout dépend du CA réel, du rythme de mission, du foyer fiscal et de la discipline de provision. Le freelance peut gagner plus, autant ou moins selon le contexte.',
      },
      {
        question: 'Pourquoi calculer un point d’équilibre ?',
        answer:
          'Parce qu’il indique le niveau de CA mensuel à partir duquel le net freelance dépasse réellement le net salarié. C’est un repère très utile avant une transition.',
      },
      {
        question: 'Le comparatif inclut-il les congés non payés ?',
        answer:
          'Pas directement dans la formule principale. En revanche, la page rappelle pourquoi ces jours non facturés doivent entrer dans votre réflexion globale.',
      },
      {
        question: 'Puis-je utiliser cette page sans compte ?',
        answer:
          'Oui. Le comparatif est entièrement public. Le compte gratuit sert ensuite à suivre votre net dans le temps et à recevoir les alertes.',
      },
      {
        question: 'Pourquoi mon foyer fiscal compte-t-il ?',
        answer:
          'Parce qu’il modifie l’impôt estimé côté freelance. Une personne célibataire et un couple marié n’auront pas la même lecture du net après impôt.',
      },
    ],
    officialSources: [officialSources.urssafStatus, officialSources.versementLiberatoire],
  },
  {
    slug: 'calculateur-tjm',
    variant: 'tjm',
    title: 'Calculateur TJM Freelance 2026 — Quel Tarif Journalier Fixer ?',
    description:
      'Calculez votre TJM minimum pour atteindre votre objectif de revenu net. Inclut URSSAF, impôts, congés et périodes non facturables.',
    keywords: [
      'calcul tjm freelance',
      'quel tjm facturer auto-entrepreneur',
      'tjm micro-entrepreneur calcul',
      'calculateur tjm',
      'objectif net tjm freelance',
    ],
    cardTitle: 'Calculateur TJM freelance',
    cardDescription:
      'Entrez votre objectif net mensuel et obtenez un TJM réaliste, avec marge de sécurité et jours non facturables.',
    heroEyebrow: 'TJM freelance 2026',
    heroTitle: 'Quel TJM faut-il vraiment facturer pour atteindre votre net cible ?',
    heroSubtitle:
      'Cette page répond à la question qui arrive avant même la première mission : combien facturer par jour pour sortir le bon net à la fin du mois ? Le calculateur part de votre objectif net, intègre URSSAF et fiscalité, puis remonte vers un TJM cohérent.',
    updatedAt: '2026-03-11',
    updateNote: 'Mis à jour le 11 mars 2026 — taux URSSAF et barème IR 2026 vérifiés.',
    introPoints: [
      'Transformez un objectif de revenu net en TJM minimum concret.',
      'Intégrez les jours non facturables au lieu de raisonner sur un mois irréaliste.',
      'Obtenez un TJM de sécurité avec buffer pour négocier sans vous underpricer.',
    ],
    sections: [
      {
        title: 'Comment utiliser ce calculateur TJM freelance',
        paragraphs: [
          "Le TJM ne se calcule pas en divisant un revenu annuel rêvé par 20 jours facturables théoriques tous les mois. Cette méthode oublie l’essentiel : les jours de prospection, l’administratif, les congés, les périodes sans mission et le poids réel des charges. Un TJM sérieux part d’un objectif de net, remonte au chiffre d’affaires nécessaire puis convertit ce montant en tarif journalier à partir d’un nombre de jours facturables réaliste.",
          "C’est exactement ce que fait le calculateur de cette page. Vous entrez le net mensuel que vous souhaitez réellement garder. NetEnPoche calcule le CA qu’il faut générer pour atteindre ce résultat après URSSAF, impôt et provision CFE, puis le divise par votre volume de jours facturables. Le TJM obtenu n’est pas un fantasme de commercial. C’est un seuil de survie ou de confort selon le niveau retenu.",
          "Un bon TJM n’est donc pas seulement un chiffre de marché. C’est un chiffre compatible avec votre modèle économique, vos charges et votre rythme réel."
        ],
      },
      {
        title: 'Les erreurs de calcul TJM les plus fréquentes',
        paragraphs: [
          "L’erreur numéro un consiste à supposer que vous facturerez presque tous les jours ouvrés. En réalité, même un freelance bien occupé passe du temps à prospecter, répondre à des appels, corriger des devis, faire de l’administratif, se former ou tout simplement souffler entre deux missions. Si vous basez votre TJM sur 21 ou 22 jours facturables permanents, vous sous-facturez presque toujours.",
          "La deuxième erreur consiste à viser un net cible sans intégrer le couple URSSAF + impôt. Le TJM obtenu paraît alors séduisant, mais il ne couvre pas le vrai niveau de revenu souhaité. Enfin, beaucoup d’indépendants oublient de se laisser une marge de négociation. Un TJM 'minimum' n’est pas un TJM 'confortable'. Si vous n’avez aucune marge, la première remise commerciale vous fait sortir de votre trajectoire.",
          "Le calculateur ci-dessous force justement ces trois réalités dans le modèle : jours facturables, charges et buffer."
        ],
        bullets: [
          'Ne pas compter 20+ jours facturables chaque mois par défaut.',
          'Ne jamais fixer un TJM à partir du CA rêvé sans passer par le net.',
          'Prévoir un buffer de négociation et de sécurité.',
        ],
      },
      {
        title: 'Le vrai nombre de jours facturables sur une année',
        paragraphs: [
          "Le repère de 15 à 16 jours facturables par mois est souvent plus réaliste que 20 ou 21. Une année commence avec 365 jours. Une fois retirés les week-ends, les congés, les jours fériés, les temps non facturables et les creux de mission, le stock de jours réellement monétisables est nettement plus faible que ce que l’on imagine au début.",
          "C’est pourquoi le slider de cette page est crucial. Il ne sert pas à faire joli. Il matérialise votre réalité commerciale. Un consultant bien installé peut viser davantage de jours facturables ; un freelance qui démarre ou qui vend des prestations plus complexes doit souvent rester prudent. Le bon TJM n’est pas celui qui vous rassure psychologiquement, mais celui qui résiste à vos mois imparfaits."
        ],
        table: {
          headers: ['Repère annuel', 'Jours'],
          rows: [
            ['Année civile', '365'],
            ['Week-ends', '-104'],
            ['Congés', '-25'],
            ['Jours fériés', '-10'],
            ['Prospection / admin / formation', '-30'],
            ['Reste facturable', '≈ 196 jours / an'],
          ],
        },
      },
      {
        title: 'TJM par secteur en France en 2026',
        paragraphs: [
          "Le marché donne des repères, pas une vérité absolue. Un TJM dépend du secteur, de la rareté de la compétence, du niveau d’expérience, de la localisation, de la spécialisation et de la capacité à vendre un résultat plutôt qu’un temps. Le tableau ci-dessous vous donne une fourchette de marché utile pour vérifier si votre TJM calculé est dans une zone crédible.",
          "La bonne utilisation de ces repères est simple : si votre TJM minimum calculé est largement au-dessus du marché, votre objectif net ou votre nombre de jours facturables n’est peut-être pas réaliste. S’il est très en dessous, vous êtes probablement en train de sous-facturer votre activité."
        ],
        table: {
          headers: ['Métier', 'TJM de marché observé'],
          rows: [
            ['Développeur freelance', '400 à 700 € / jour'],
            ['Designer / DA', '350 à 600 € / jour'],
            ['Consultant business / ops', '500 à 900 € / jour'],
            ['Marketing / acquisition', '350 à 650 € / jour'],
            ['Coach / formateur', '300 à 700 € / jour'],
          ],
        },
      },
      {
        title: 'Négocier son TJM sans casser son modèle',
        paragraphs: [
          "Un bon TJM sert aussi de garde-fou en négociation. Si vous connaissez votre minimum absolu, vous savez où s’arrête la discussion. Si vous connaissez votre TJM confortable, vous savez où commencer sans vous saboter. Cette mécanique vous évite de dire oui à une mission qui paraît belle sur le papier mais vous laisse sous votre seuil de rentabilité réel.",
          "Les meilleurs arguments de négociation sont souvent plus simples qu’on ne l’imagine : clarté du périmètre, impact business, expérience sur un problème similaire, rapidité d’exécution et économie de coordination pour le client. Un TJM se défend mieux quand il est relié à une valeur produite qu’à une simple comparaison avec le marché.",
          "Le calculateur vous donne donc un chiffre, mais le bon usage consiste à le transformer en stratégie commerciale."
        ],
      },
    ],
    faq: [
      {
        question: 'Comment choisir un nombre réaliste de jours facturables ?',
        answer:
          'Pour un freelance généraliste, 15 à 16 jours par mois est souvent un bon point de départ. Cela laisse de la place pour la prospection, l’administratif, les congés et les imprévus.',
      },
      {
        question: 'Le TJM minimum suffit-il pour se lancer ?',
        answer:
          'Il donne un seuil de survie. En pratique, il vaut mieux viser un TJM confortable avec une marge de sécurité afin d’absorber les périodes moins pleines et les négociations.',
      },
      {
        question: 'Pourquoi partir du net mensuel désiré ?',
        answer:
          'Parce que c’est la seule métrique qui reflète votre objectif de vie. Le CA et le TJM ne sont que des moyens d’atteindre ce net réel.',
      },
      {
        question: 'Le calcul inclut-il l’impôt ?',
        answer:
          'Oui, le calculateur tient compte de l’URSSAF et de l’impôt selon le mode fiscal choisi, avec une provision CFE pour rester prudent.',
      },
      {
        question: 'Puis-je utiliser ce calculateur sans compte ?',
        answer:
          'Oui. Le calcul est public. Le compte gratuit sert ensuite à suivre le même objectif dans le dashboard au fil des mois.',
      },
      {
        question: 'Comment savoir si mon TJM est trop bas ?',
        answer:
          'Si votre TJM calculé ne laisse aucune marge de négociation, ne couvre pas vos jours non facturables ou reste nettement sous les repères du marché, il est probablement trop bas.',
      },
    ],
    officialSources: [officialSources.urssafStatus, officialSources.versementLiberatoire, officialSources.tvaThresholds],
  },
];

export function getSeoCalculatorPage(slug: string) {
  return seoCalculatorPages.find((page) => page.slug === slug);
}

export function getSeoCalculatorPageOrThrow(slug: string) {
  const page = getSeoCalculatorPage(slug);

  if (!page) {
    throw new Error('Unknown SEO calculator page: ' + slug);
  }

  return page;
}







