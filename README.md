# Examen civique — Plateforme d'entraînement

Plateforme web **non officielle** pour préparer l'examen civique demandé dans le cadre de la naturalisation française et de certaines demandes de titres de séjour (en vigueur depuis le 1er janvier 2026).

> Ce site n'est **pas** un service de l'État. Il propose des fiches de révision, des QCM, des mises en situation et un examen blanc, rédigés de manière originale à des fins éducatives.

## Ce que la plateforme propose

- **10 thèmes** de révision (valeurs, symboles, laïcité, droits et devoirs, institutions, UE, histoire, géographie & culture, vivre en société, égalité femmes-hommes).
- **10 quiz** (6 QCM + 2 mises en situation par thème) avec correction immédiate et explication.
- **Examen blanc** de 40 questions, 45 minutes, seuil indicatif 32/40, avec bilan par thème et recommandations ciblées.
- **Progression locale** enregistrée dans le navigateur (aucun compte, aucun serveur).

## Stack technique

- [Astro](https://astro.build) 4 (site statique, content collections)
- TypeScript strict
- Tailwind CSS (thème `brand` + `ink`, polices Inter + Fraunces)
- nanostores + localStorage pour la progression
- Cible de déploiement : [Netlify](https://www.netlify.com/)

## Prérequis

- Node.js **20+** (voir `.nvmrc`)
- npm 10+

## Démarrage local

```bash
npm install
npm run dev
```

Le site démarre sur `http://localhost:4321`.

### Autres scripts

```bash
npm run build       # génère le site statique dans dist/
npm run preview     # sert dist/ pour vérifier le build
npm run typecheck   # vérifie les types Astro/TypeScript
```

## Déploiement sur Netlify

Le fichier `netlify.toml` à la racine configure le build et les headers de sécurité. **Aucun réglage supplémentaire n'est requis**.

### Méthode 1 — Via le tableau de bord Netlify

1. Connectez-vous sur [app.netlify.com](https://app.netlify.com) et cliquez sur **Add new site → Import an existing project**.
2. Sélectionnez votre fournisseur Git et autorisez Netlify à accéder au dépôt.
3. Choisissez le dépôt `examen_civique_fr` et la branche souhaitée (par exemple `main` ou la branche de feature).
4. Les paramètres suivants sont auto-détectés depuis `netlify.toml` :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node.js** : 20
5. Cliquez sur **Deploy site**. Le premier build prend environ 1 à 2 minutes.

### Méthode 2 — Via la CLI Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init          # lier le repo local à un site Netlify
netlify deploy --prod # déploiement en production
```

### Domaines et HTTPS

Netlify fournit automatiquement un sous-domaine `https://<nom-du-site>.netlify.app` avec un certificat TLS. Pour un domaine personnalisé, ajoutez-le dans **Site settings → Domain management**.

## Structure du projet

```
.
├── public/                  # assets statiques (favicon, robots.txt)
├── src/
│   ├── assets/styles/       # global.css (Tailwind + composants)
│   ├── components/
│   │   ├── exam/            # ExamRunner (timer + bilan 40 Q)
│   │   ├── fiche/           # FicheHeader, CTAQuiz
│   │   ├── layout/          # Header, Footer
│   │   ├── quiz/            # QuizRunner (client-side)
│   │   └── ui/              # Alert, ProgressBar, ThemeCard, ProgressSummary
│   ├── content/
│   │   ├── config.ts        # schéma de la collection `themes`
│   │   └── themes/*.md      # 10 fiches de révision
│   ├── data/
│   │   ├── quizzes/*.json   # 10 quiz (8 questions chacun)
│   │   └── exam-final.json  # 40 questions de l'examen blanc
│   ├── layouts/             # BaseLayout.astro
│   ├── lib/                 # storage, scoring, shuffle, progress, quiz-loader, types
│   ├── pages/               # /, /themes, /themes/[slug], /quiz/[slug], /examen-blanc, /a-propos, /mentions-legales, /404
│   └── stores/              # nanostores persistants
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── netlify.toml
└── package.json
```

## Ajouter un thème

1. Créer `src/content/themes/<slug>.md` en suivant le modèle existant (frontmatter + sections **Notions clés**, **Pièges fréquents**, **Mini récap**).
2. Créer `src/data/quizzes/<slug>.json` (6 QCM + 2 mises en situation, `themeSlug` identique).
3. Vérifier localement avec `npm run dev`. Le thème apparaît automatiquement dans `/themes` et `/themes/<slug>`.

## Règles éditoriales

- Rédaction en **français simple (A2–B1)**, phrases courtes, définitions des mots techniques.
- Contenus **originaux**, reformulés à partir des thématiques publiques de l'examen.
- Aucune mention officielle abusive. Le site n'est pas un service de l'État.
- Corrections toujours **explicatives**, jamais moralisatrices.

## Accessibilité et performance

- Skip-link, focus visible, contrastes AA, HTML sémantique, `prefers-reduced-motion` respecté.
- Site 100 % statique : temps de chargement minimal, pas de JavaScript framework embarqué.
- Fonts chargées depuis Google Fonts avec `preconnect`.

## Licence

Code sous licence du fichier `LICENSE`. Contenus pédagogiques originaux rédigés pour cette plateforme.
