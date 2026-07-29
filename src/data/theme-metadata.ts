export interface ThemeSource {
  title: string;
  url: string;
  verifiedAt: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ThemeMetadata {
  officialTheme: string;
  takeaways: string[];
  flashcards: Flashcard[];
  sources: ThemeSource[];
}

const VERIFIED_AT = "2026-07-29";
const LIVRET = {
  title: "Livret du citoyen — juillet 2026",
  url: "https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/livret-du-citoyen.html",
  verifiedAt: VERIFIED_AT,
};
const OFFICIAL_QUESTIONS = {
  title: "Questions de connaissance pour l'examen civique — Nationalité française",
  url: "https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/questions-de-connaissance-pour-lexamen-civique-nationalite-francaise.html",
  verifiedAt: VERIFIED_AT,
};
const RESIDENCE_EXAM = {
  title: "Examen civique pour une CSP ou une carte de résident",
  url: "https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/lexamen-civique-pour-demande-de-carte-de-sejour-pluriannuelle-csp-ou-de-carte-de-resident-cr.html",
  verifiedAt: VERIFIED_AT,
};

export const THEME_METADATA: Record<string, ThemeMetadata> = {
  "valeurs-republique": {
    officialTheme: "Principes et valeurs de la République française",
    takeaways: [
      "La République est indivisible, laïque, démocratique et sociale.",
      "Sa devise est Liberté, Égalité, Fraternité.",
      "La loi s'applique à tous, y compris à l'État et à l'administration.",
    ],
    flashcards: [
      { front: "Quels sont les quatre principes de la République ?", back: "Indivisible, laïque, démocratique et sociale." },
      { front: "Que signifie l'État de droit ?", back: "L'État, ses administrations et ses agents doivent respecter la loi." },
      { front: "À qui appartient la souveraineté nationale ?", back: "Au peuple, qui l'exerce par le vote et ses représentants." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  "symboles-republique": {
    officialTheme: "Principes et valeurs de la République française",
    takeaways: [
      "Le drapeau national est bleu, blanc, rouge.",
      "La Marseillaise est l'hymne national et Marianne représente la République.",
      "La fête nationale a lieu le 14 juillet.",
    ],
    flashcards: [
      { front: "Quelle est la devise de la France ?", back: "Liberté, Égalité, Fraternité." },
      { front: "Qui a écrit La Marseillaise ?", back: "Rouget de Lisle, en 1792." },
      { front: "Le coq gaulois est-il un symbole officiel ?", back: "Non. C'est un emblème populaire." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  laicite: {
    officialTheme: "Principes et valeurs de la République française",
    takeaways: [
      "La laïcité protège la liberté de croire, de ne pas croire et de changer de religion.",
      "L'État et ses agents doivent rester neutres face aux religions.",
      "Dans l'espace public, les citoyens conservent leur liberté dans le respect de la loi.",
    ],
    flashcards: [
      { front: "Quelle loi organise la séparation des Églises et de l'État ?", back: "La loi du 9 décembre 1905." },
      { front: "Qui doit respecter la neutralité religieuse pendant son service ?", back: "Les agents publics." },
      { front: "La laïcité interdit-elle les religions ?", back: "Non. Elle protège la liberté de conscience et le libre exercice des cultes." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  "droits-devoirs": {
    officialTheme: "Droits et devoirs",
    takeaways: [
      "Les libertés sont garanties, mais elles s'exercent dans le respect de la loi et des autres.",
      "Les impôts financent les services publics et la solidarité nationale.",
      "Le recensement citoyen est obligatoire pour les jeunes Français à partir de 16 ans.",
    ],
    flashcards: [
      { front: "Pourquoi paie-t-on des impôts ?", back: "Pour financer notamment l'école, la santé, la sécurité et les infrastructures." },
      { front: "La liberté d'expression permet-elle tout ?", back: "Non. La loi interdit notamment les menaces, la diffamation et l'appel à la haine." },
      { front: "À quel âge faut-il se faire recenser ?", back: "À partir de 16 ans pour les jeunes Français." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS, RESIDENCE_EXAM],
  },
  institutions: {
    officialTheme: "Système institutionnel et politique",
    takeaways: [
      "Le président de la République est le chef de l'État.",
      "Le Gouvernement conduit la politique de la nation et le Parlement vote les lois.",
      "La justice est indépendante et contrôle le respect du droit.",
    ],
    flashcards: [
      { front: "Quelles sont les deux chambres du Parlement ?", back: "L'Assemblée nationale et le Sénat." },
      { front: "Qui dirige l'action du Gouvernement ?", back: "Le Premier ministre." },
      { front: "Qui représente l'État dans le département ?", back: "Le préfet." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  "ue-international": {
    officialTheme: "Système institutionnel et politique",
    takeaways: [
      "La France est membre de l'Union européenne.",
      "Les citoyens européens élisent directement les députés au Parlement européen.",
      "L'Union européenne, le Conseil de l'Europe et l'ONU sont des organisations différentes.",
    ],
    flashcards: [
      { front: "Combien d'étoiles comporte le drapeau européen ?", back: "Douze étoiles, symbole d'unité et d'harmonie." },
      { front: "Comment sont choisis les députés européens ?", back: "Ils sont élus au suffrage universel direct." },
      { front: "La France utilise-t-elle l'euro ?", back: "Oui, elle appartient à la zone euro." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  histoire: {
    officialTheme: "Histoire, géographie et culture",
    takeaways: [
      "1789 marque le début de la Révolution française et la Déclaration des droits de l'homme et du citoyen.",
      "La République a été proclamée pour la première fois en 1792.",
      "Les femmes françaises ont voté pour la première fois en 1945.",
    ],
    flashcards: [
      { front: "Que se passe-t-il en 1789 ?", back: "La Révolution française commence et la Déclaration des droits de l'homme et du citoyen est adoptée." },
      { front: "Quand débute la Ve République ?", back: "En 1958." },
      { front: "Quand les Françaises votent-elles pour la première fois ?", back: "En 1945, après l'ordonnance de 1944." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  "geographie-culture": {
    officialTheme: "Histoire, géographie et culture",
    takeaways: [
      "Paris est la capitale de la France.",
      "La France comprend des territoires en Europe et outre-mer.",
      "La culture française comprend un patrimoine historique, artistique, scientifique et gastronomique.",
    ],
    flashcards: [
      { front: "Combien la France métropolitaine compte-t-elle de régions ?", back: "Treize régions." },
      { front: "La Guyane fait-elle partie de la France ?", back: "Oui. C'est un territoire français d'outre-mer en Amérique du Sud." },
      { front: "Quel est le plus haut sommet de France ?", back: "Le mont Blanc, dans les Alpes." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
  "vivre-en-societe": {
    officialTheme: "Vivre dans la société française",
    takeaways: [
      "L'école est obligatoire pour les enfants de 3 à 16 ans.",
      "La Sécurité sociale protège contre plusieurs risques, notamment la maladie et la vieillesse.",
      "Les numéros 15, 17, 18 et 112 permettent de joindre les principaux services d'urgence.",
    ],
    flashcards: [
      { front: "Quel numéro appelle-t-on pour le Samu ?", back: "Le 15." },
      { front: "Quelle est la durée légale hebdomadaire du travail à temps plein ?", back: "35 heures, sous réserve des règles applicables au contrat et à la convention collective." },
      { front: "À partir de quel âge l'école est-elle obligatoire ?", back: "À partir de 3 ans, jusqu'à 16 ans." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS, RESIDENCE_EXAM],
  },
  "egalite-situations": {
    officialTheme: "Droits et devoirs",
    takeaways: [
      "La loi interdit les discriminations fondées notamment sur le sexe, l'origine, la religion ou le handicap.",
      "Les femmes et les hommes ont les mêmes droits.",
      "Une victime ou un témoin peut demander de l'aide et signaler une discrimination ou une violence.",
    ],
    flashcards: [
      { front: "Un employeur peut-il écarter une candidate parce qu'elle est enceinte ?", back: "Non. Cela peut constituer une discrimination interdite." },
      { front: "L'égalité signifie-t-elle que toutes les situations sont identiques ?", back: "Non. Elle signifie notamment que les mêmes droits et protections s'appliquent sans discrimination." },
      { front: "Quel numéro national informe et oriente les femmes victimes de violences ?", back: "Le 3919. En cas d'urgence immédiate, il faut contacter les secours." },
    ],
    sources: [LIVRET, OFFICIAL_QUESTIONS],
  },
};

const FALLBACK: ThemeMetadata = {
  officialTheme: "Examen civique",
  takeaways: ["Lire la fiche.", "Faire le quiz.", "Revoir les erreurs."],
  flashcards: [
    { front: "Comment réviser ce thème ?", back: "Lire, répondre sans aide, puis revoir les erreurs." },
    { front: "Quand refaire le quiz ?", back: "Après avoir relu les notions mal maîtrisées." },
  ],
  sources: [LIVRET],
};

export function getThemeMetadata(slug: string): ThemeMetadata {
  return THEME_METADATA[slug] ?? FALLBACK;
}
