// Configuration Google AdSense.
// L'identifiant éditeur (client) est public ; les identifiants d'emplacement
// (slots) doivent être créés dans le tableau de bord AdSense puis recopiés ici.
export const ADSENSE_CLIENT = "ca-pub-8314275628109526";

// Identifiants d'emplacement AdSense.
// TODO: remplacer chaque valeur par l'ID réel du bloc créé dans AdSense
// (Annonces → Par bloc d'annonces). Tant que ces valeurs sont "0000000000",
// aucune annonce ne s'affichera, même après consentement.
export const AD_SLOTS = {
  themesList: "0000000000",
  ficheContent: "0000000000",
  home: "0000000000",
} as const;
