# Examen civique — Plateforme d'entraînement

Plateforme d'entraînement **non officielle** pour préparer l'examen civique demandé dans le cadre de la naturalisation française et de certaines demandes de titres de séjour (en vigueur depuis le 1er janvier 2026).

Ce site n'est pas un service de l'État. Il propose des fiches de révision, des QCM, des mises en situation et un examen blanc pour s'entraîner.

## Stack

- Astro (statique) + TypeScript
- Tailwind CSS
- nanostores + localStorage (progression locale)
- Déploiement : Netlify

## Démarrage local

```bash
npm install
npm run dev
```

Le site démarre sur http://localhost:4321.

## Build

```bash
npm run build
npm run preview
```

## Déploiement Netlify

Le fichier `netlify.toml` est prêt. Importer le dépôt dans Netlify, aucun réglage supplémentaire requis.

## Structure

```
src/
  components/   UI, fiche, quiz, exam, layout
  content/      Fiches de révision (Markdown)
  data/         Quiz (JSON) et examen final
  layouts/      Layouts Astro
  lib/          Helpers (storage, scoring, shuffle)
  pages/        Routes
  stores/       État (nanostores + localStorage)
```

## Licence

Voir `LICENSE`. Contenu pédagogique original rédigé pour cette plateforme.
