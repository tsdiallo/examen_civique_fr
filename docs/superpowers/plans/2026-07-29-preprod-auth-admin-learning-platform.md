# Preproduction Auth Admin Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Déployer une préproduction isolée intégrant trois parcours pédagogiques, une authentification Supabase, une progression synchronisée, un examen blanc conforme et un dashboard administrateur sécurisé.

**Architecture:** Le site Astro reste statique pour les pages publiques. Supabase Auth et PostgreSQL gèrent les comptes et les données utilisateur avec RLS ; les opérations administrateur passent exclusivement par des Netlify Functions qui vérifient le JWT puis l’allowlist `ADMIN_EMAILS`. La branche de feature et le site Netlify de préproduction sont isolés de `main` et de la production.

**Tech Stack:** Astro 4, TypeScript 5.6, Tailwind CSS 3, Supabase JS, Netlify Functions, Vitest, Playwright.

## Global Constraints

- Ne jamais modifier ou merger `main`.
- Utiliser la branche `feat/preprod-auth-admin-learning-platform`.
- La préproduction utilise des variables et une base Supabase distinctes de la production.
- `SUPABASE_SERVICE_ROLE_KEY` reste exclusivement côté serveur.
- L’accès admin est vérifié côté serveur avec JWT + `ADMIN_EMAILS`.
- Le site reste utilisable sans compte.
- L’examen blanc contient exactement 40 questions : 28 connaissances, 12 situations, 45 minutes, seuil 32/40.
- La préproduction est `noindex`.

---

## File Structure

### Configuration et tests

- Modify: `package.json` — dépendances Supabase, Vitest, Playwright et scripts.
- Modify: `astro.config.mjs` — URL de site explicite, configuration préproduction.
- Modify: `netlify.toml` — fonctions, headers, contexte branch-deploy et redirections SPA ciblées.
- Create: `.env.example` — variables publiques et serveur documentées.
- Create: `vitest.config.ts` — environnement de tests TypeScript.
- Create: `playwright.config.ts` — tests E2E sur preview locale/préprod.

### Supabase

- Create: `supabase/migrations/202607290001_auth_learning_admin.sql` — tables, triggers et RLS.
- Create: `src/lib/supabase/client.ts` — client navigateur singleton.
- Create: `src/lib/supabase/session.ts` — helpers de session.
- Create: `src/lib/auth/admin.ts` — validation serveur JWT + allowlist.
- Create: `src/lib/auth/redirect.ts` — URLs de callback sûres.

### Auth et espace personnel

- Create: `src/components/auth/AuthForm.astro` — inscription/connexion/récupération.
- Create: `src/components/auth/AuthNav.astro` — état connecté dans le header.
- Create: `src/components/account/AccountDashboard.astro` — progression et historique.
- Create: `src/pages/connexion.astro`.
- Create: `src/pages/inscription.astro`.
- Create: `src/pages/mot-de-passe-oublie.astro`.
- Create: `src/pages/reinitialiser-mot-de-passe.astro`.
- Create: `src/pages/mon-espace.astro`.
- Modify: `src/components/layout/Header.astro` — liens compte et menu accessible.

### Parcours et apprentissage

- Create: `src/lib/learning/paths.ts` — types et configuration CSP/résident/naturalisation.
- Create: `src/lib/learning/selection.ts` — persistance locale + synchronisation profil.
- Create: `src/pages/choisir-mon-parcours.astro`.
- Create: `src/components/learning/PathSelector.astro`.
- Create: `src/components/learning/SourceList.astro`.
- Create: `src/components/learning/ContentReport.astro`.
- Modify: `src/content/config.ts` — schéma enrichi.
- Modify: `src/pages/themes/[slug].astro` — sidebar, sources, dates, navigation et signalement.
- Modify: `src/components/fiche/FicheHeader.astro` — parcours/thème officiel/date.
- Modify: `src/assets/styles/global.css` — grille fiche et styles auth/admin.
- Modify: `src/content/themes/*.md` — métadonnées, formulations simplifiées et sections pédagogiques.
- Modify: `src/pages/index.astro` — promesse honnête, compteur calculé, CTA parcours.
- Create: `src/pages/ressources.astro` — liens affiliés regroupés.
- Modify: `src/components/ui/AffiliateBlock.astro` — utilisé uniquement sur `/ressources`.

### Examen et progression

- Create: `src/lib/exam/blueprint.ts` — sélection stricte 28/12.
- Create: `src/lib/exam/validate.ts` — validation des questions.
- Modify: `src/lib/types.ts` — `ExamMention`, `OfficialTheme`, `QuestionType`, sources.
- Modify: `src/lib/quiz-loader.ts` — chargement filtré par parcours.
- Modify: `src/components/exam/ExamRunner.astro` — génération, reprise, synchronisation.
- Modify: `src/components/quiz/QuizRunner.astro` — erreurs et maîtrise.
- Create: `src/lib/progress/cloud.ts` — upserts Supabase et fallback local.
- Create: `src/lib/progress/mastery.ts` — calcul de maîtrise et prochaine révision.

### Administration

- Create: `netlify/functions/_shared/http.ts` — réponses JSON et CORS.
- Create: `netlify/functions/_shared/admin.ts` — garde admin.
- Create: `netlify/functions/admin-overview.ts`.
- Create: `netlify/functions/admin-users.ts`.
- Create: `netlify/functions/admin-content-status.ts`.
- Create: `netlify/functions/admin-reports.ts`.
- Create: `src/components/admin/AdminDashboard.astro`.
- Create: `src/pages/admin.astro`.

### Tests

- Create: `tests/unit/exam-blueprint.test.ts`.
- Create: `tests/unit/question-validation.test.ts`.
- Create: `tests/unit/mastery.test.ts`.
- Create: `tests/unit/admin-auth.test.ts`.
- Create: `tests/e2e/public-learning.spec.ts`.
- Create: `tests/e2e/auth.spec.ts`.
- Create: `tests/e2e/admin-guard.spec.ts`.

---

### Task 1: Installer le socle Supabase et les tests

**Files:** `package.json`, `.env.example`, `vitest.config.ts`, `playwright.config.ts`, `src/lib/supabase/client.ts`.

**Interfaces:**
- Produces: `getSupabaseBrowserClient(): SupabaseClient`.

- [ ] Ajouter `@supabase/supabase-js`, `vitest`, `@vitest/coverage-v8`, `@playwright/test`.
- [ ] Ajouter les scripts `test`, `test:watch`, `test:e2e`, `check`.
- [ ] Documenter `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `PUBLIC_APP_ENV`, `PUBLIC_SITE_URL`.
- [ ] Implémenter le client navigateur avec une erreur explicite si les variables publiques manquent.
- [ ] Exécuter `npm run typecheck` puis `npm test`.
- [ ] Commit : `chore: add supabase and test foundation`.

### Task 2: Créer le schéma PostgreSQL et les politiques RLS

**Files:** `supabase/migrations/202607290001_auth_learning_admin.sql`.

**Interfaces:**
- Produces tables: `profiles`, `learning_progress`, `exam_attempts`, `content_reports`.

- [ ] Créer les tables avec contraintes de parcours et scores.
- [ ] Créer `handle_new_user()` et le trigger sur `auth.users`.
- [ ] Activer RLS sur chaque table.
- [ ] Ajouter les policies propriétaire pour profils/progression/tentatives.
- [ ] Autoriser uniquement l’insertion authentifiée dans `content_reports`.
- [ ] Interdire toute lecture admin directe avec la clé anon.
- [ ] Valider la migration dans le projet Supabase de préproduction.
- [ ] Commit : `feat: add secure learning database schema`.

### Task 3: Implémenter l’authentification email/mot de passe

**Files:** composants et pages auth, `Header.astro`, `session.ts`, `redirect.ts`.

**Interfaces:**
- Produces: `signInWithPassword`, `signUp`, `resetPasswordForEmail`, `updateUser` via client Supabase.

- [ ] Écrire un test de rendu vérifiant labels, autocomplete et messages génériques.
- [ ] Créer un formulaire partagé avec modes `sign-in`, `sign-up`, `forgot`, `reset`.
- [ ] Refuser côté client les mots de passe de moins de 10 caractères avant appel réseau.
- [ ] Configurer les callbacks exclusivement à partir de `PUBLIC_SITE_URL`.
- [ ] Ajouter l’état de session au header et la déconnexion.
- [ ] Vérifier clavier, erreurs, chargement et mobile.
- [ ] Commit : `feat: add email password authentication`.

### Task 4: Synchroniser la progression et créer l’espace personnel

**Files:** `cloud.ts`, `mastery.ts`, `AccountDashboard.astro`, `mon-espace.astro`.

**Interfaces:**
- `computeMastery(correct: number, total: number, previous: number): number`.
- `nextReviewDate(mastery: number, from?: Date): Date`.
- `syncLocalProgress(userId: string): Promise<SyncResult>`.

- [ ] Écrire les tests maîtrise : 0–100, progression monotone raisonnable, intervalles 1/3/7/14 jours.
- [ ] Implémenter les fonctions pures.
- [ ] Implémenter les upserts Supabase avec `user_id` obtenu de la session, jamais du DOM.
- [ ] Migrer la progression localStorage au premier login sans supprimer les données locales avant succès.
- [ ] Afficher parcours, maîtrise, erreurs, prochaine révision et examens.
- [ ] Commit : `feat: sync learning progress across devices`.

### Task 5: Ajouter les trois parcours

**Files:** `paths.ts`, `selection.ts`, `PathSelector.astro`, `choisir-mon-parcours.astro`, `index.astro`.

**Interfaces:**
- `type ExamMention = 'csp' | 'resident' | 'naturalisation'`.
- `getLearningPath(slug: ExamMention): LearningPath`.
- `getSelectedPath(): ExamMention | null`.

- [ ] Écrire les tests sur les trois slugs et le fallback.
- [ ] Définir titres, descriptions, exigences et CTA sans confondre niveau linguistique et niveau de lecture.
- [ ] Enregistrer localement puis synchroniser dans `profiles.selected_path` si connecté.
- [ ] Ajouter le CTA principal vers le sélecteur.
- [ ] Ajouter une bannière de parcours actif dans les pages de révision.
- [ ] Commit : `feat: add exam preparation paths`.

### Task 6: Enrichir les contenus et les fiches

**Files:** schéma de contenu, composants de fiche, thèmes Markdown, page ressources.

**Interfaces:**
- Frontmatter requis : `officialTheme`, `examMentions`, `lastReviewedAt`, `sources`, `concepts`.

- [ ] Faire échouer le build si une source, une date ou un parcours manque.
- [ ] Ajouter résumé 30 secondes, exemples, pièges, sources et date.
- [ ] Remplacer les points médians par des formulations neutres simples.
- [ ] Ajouter sidebar sticky, précédent/suivant et signalement.
- [ ] Retirer `AffiliateBlock` des fiches et l’utiliser uniquement sur `/ressources`.
- [ ] Remplacer « sans publicité » par une formulation exacte.
- [ ] Calculer le nombre réel de questions au build.
- [ ] Commit : `feat: improve sourced learning sheets`.

### Task 7: Rendre l’examen blanc strictement conforme

**Files:** `blueprint.ts`, `validate.ts`, types, loader, runner, tests.

**Interfaces:**
- `buildExam(questions: Question[], mention: ExamMention, random?: RandomFn): Question[]`.
- `validateQuestion(question: Question): ValidationIssue[]`.

- [ ] Écrire un test avec un jeu de données déterministe vérifiant 40/28/12.
- [ ] Écrire les tests d’erreur : ID dupliqué, mauvais nombre de choix, réponse absente, source absente.
- [ ] Implémenter la validation puis la sélection par parcours et thème officiel.
- [ ] Bloquer le build si la banque ne permet pas de produire un examen conforme.
- [ ] Ajouter sauvegarde/reprise et synchronisation des tentatives.
- [ ] Commit : `feat: enforce official exam blueprint`.

### Task 8: Sécuriser les fonctions administrateur

**Files:** helpers et quatre Netlify Functions, tests auth.

**Interfaces:**
- `requireAdmin(request: Request): Promise<AdminContext>`.
- `AdminContext = { userId: string; email: string; supabaseAdmin: SupabaseClient }`.

- [ ] Tester token absent → 401, token invalide → 401, email hors allowlist → 403.
- [ ] Vérifier le JWT avec `supabase.auth.getUser(token)` côté serveur.
- [ ] Parser `ADMIN_EMAILS` en emails normalisés exacts.
- [ ] Utiliser le service role uniquement après autorisation réussie.
- [ ] Ajouter overview, utilisateurs paginés, statut contenus et signalements.
- [ ] Retourner des erreurs génériques et journaliser uniquement côté serveur.
- [ ] Commit : `feat: add server protected admin api`.

### Task 9: Créer le dashboard administrateur

**Files:** `AdminDashboard.astro`, `admin.astro`.

**Interfaces:**
- Consumes endpoints `/.netlify/functions/admin-*` avec Bearer token.

- [ ] Créer la garde client : session absente → connexion, 401/403 → page interdite.
- [ ] Afficher métriques, utilisateurs, contenus à revoir et signalements.
- [ ] Ne proposer aucune suppression utilisateur dans le MVP.
- [ ] Ajouter états vide, erreur et rechargement.
- [ ] Tester qu’un compte standard n’obtient aucune donnée même via appel direct.
- [ ] Commit : `feat: add private admin dashboard`.

### Task 10: Durcir sécurité, confidentialité et accessibilité

**Files:** `BaseLayout.astro`, `Header.astro`, `global.css`, `netlify.toml`, polices locales.

- [ ] Auto-héberger les polices WOFF2 et supprimer les appels Google Fonts.
- [ ] Ajouter CSP compatible Supabase/Netlify sans `unsafe-eval`.
- [ ] Ajouter `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` adaptés.
- [ ] Mettre à jour l’aria-label du menu, fermer avec Escape et restaurer le focus.
- [ ] Désactiver `background-attachment: fixed` sur mobile.
- [ ] Ajouter bannière et `noindex` en préproduction.
- [ ] Commit : `security: harden preproduction and accessibility`.

### Task 11: Tester et déployer la préproduction

**Files:** tests E2E, configuration Netlify/Supabase.

- [ ] Exécuter `npm ci`.
- [ ] Exécuter `npm run typecheck`.
- [ ] Exécuter `npm test`.
- [ ] Exécuter `npm run build`.
- [ ] Exécuter les E2E public/auth/admin.
- [ ] Créer ou configurer un projet Supabase distinct de préproduction.
- [ ] Créer un site Netlify distinct lié à la branche de feature.
- [ ] Configurer toutes les variables, sans afficher leurs valeurs.
- [ ] Vérifier `noindex`, headers, mobile 390 px, navigation clavier et accès admin.
- [ ] Ouvrir une pull request en draft vers `main`, sans merge.
- [ ] Commit : `test: complete preproduction acceptance`.
