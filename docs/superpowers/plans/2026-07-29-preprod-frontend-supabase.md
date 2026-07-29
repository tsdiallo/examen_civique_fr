# Refonte frontend et Supabase — plan d’implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activer Supabase sur la préproduction et moderniser les principaux écrans sans modifier `main`.

**Architecture:** Le navigateur utilise la clé publique Supabase et les politiques RLS pour les données personnelles. Les opérations d’administration passent uniquement par des fonctions Netlify qui valident le JWT, l’email allowlisté et utilisent la clé `service_role` côté serveur. Le frontend Astro conserve un fallback local lorsque l’utilisateur n’est pas connecté.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, Supabase Auth/Postgres/RLS, Netlify Functions, Vitest, GitHub Actions.

## Global Constraints

- Branche unique : `feat/preprod-auth-admin-learning-platform`.
- Ne jamais modifier ni fusionner `main`.
- Ne jamais commiter de clé `service_role`.
- Projet Supabase : `examencivique-preprod`, région `eu-west-3`.
- URL préproduction : `https://preprodexam.netlify.app`.
- PR #4 conservée en brouillon.

---

### Task 1: Activer la base Supabase

**Files:**
- Existing migration: `supabase/migrations/202607290001_auth_learning_admin.sql`

**Interfaces:**
- Produces: tables `profiles`, `learning_progress`, `exam_attempts`, `content_reports` avec RLS.

- [ ] Appliquer la migration au projet `rjiubwkmiklnmcfozhii`.
- [ ] Vérifier l’existence des tables et l’activation RLS.
- [ ] Exécuter les advisors sécurité et performance.
- [ ] Vérifier qu’un utilisateur authentifié ne peut lire que ses propres lignes.

### Task 2: Configurer Netlify et Auth

**Files:**
- Modify: `.env.example`
- Modify: `docs/preproduction-activation.md`

**Interfaces:**
- Consumes: URL et clé publique Supabase.
- Produces: variables de build/runtime Netlify et recette d’activation manuelle des secrets.

- [ ] Ajouter `PUBLIC_SUPABASE_URL` et `PUBLIC_SUPABASE_PUBLISHABLE_KEY` sur Netlify.
- [ ] Ajouter les variables serveur non sensibles disponibles.
- [ ] Documenter l’ajout manuel de `SUPABASE_SERVICE_ROLE_KEY` et `ADMIN_EMAILS`.
- [ ] Configurer dans Supabase le Site URL et les Redirect URLs exactes.

### Task 3: Refaire l’écran de connexion

**Files:**
- Modify: `src/pages/connexion.astro`
- Modify: `src/assets/styles/global.css`

**Interfaces:**
- Consumes: `getSupabaseBrowserClient`, `safeRedirectPath`.
- Produces: formulaire connexion/inscription/réinitialisation accessible et responsive.

- [ ] Créer une mise en page deux colonnes sur desktop et une colonne sur mobile.
- [ ] Ajouter une zone de confiance expliquant synchronisation, confidentialité et préparation.
- [ ] Améliorer les états chargement, erreur, succès et les libellés.
- [ ] Conserver les flux Supabase actuels.

### Task 4: Refaire Mon espace

**Files:**
- Modify: `src/pages/mon-espace.astro`
- Modify: `src/assets/styles/global.css`

**Interfaces:**
- Consumes: `profiles`, `learning_progress`, `exam_attempts`.
- Produces: tableau de bord personnel responsive.

- [ ] Ajouter un en-tête personnalisé et une carte parcours.
- [ ] Recomposer les indicateurs avec libellés et aides visuelles.
- [ ] Améliorer les barres de maîtrise et les états vides.
- [ ] Ajouter une recommandation de prochaine action fondée sur la progression.
- [ ] Ajouter des filtres `.eq("user_id", user.id)` aux requêtes pour optimiser RLS lorsque les colonnes existent.

### Task 5: Refaire Parcours et navigation

**Files:**
- Modify: `src/pages/parcours/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/assets/styles/global.css`

**Interfaces:**
- Consumes: `EXAM_PATHS`, session locale.
- Produces: sélection de parcours plus claire et navigation cohérente.

- [ ] Mettre en évidence le parcours actif.
- [ ] Ajouter une comparaison visuelle niveau/objectifs.
- [ ] Ajouter l’état actif de navigation et améliorer l’accès compte.
- [ ] Vérifier clavier, focus, menu mobile et contrastes.

### Task 6: Vérifier et livrer la préproduction

**Files:**
- Modify: PR #4 description si nécessaire.

**Interfaces:**
- Produces: CI verte et déploiement Netlify prêt à tester.

- [ ] Exécuter typecheck, tests et build via GitHub Actions.
- [ ] Vérifier le statut Netlify du dernier commit.
- [ ] Vérifier la page de connexion et le tableau de bord après activation Supabase.
- [ ] Laisser la PR en brouillon et ne pas fusionner.
