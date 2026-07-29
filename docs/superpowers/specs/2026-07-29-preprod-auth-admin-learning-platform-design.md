# Design — Préproduction, authentification, administration et parcours pédagogiques

Date : 2026-07-29
Branche cible : `feat/preprod-auth-admin-learning-platform`
Production : `main` reste inchangée

## 1. Objectif

Faire évoluer la plateforme Astro actuelle sans modifier la production, avec :

1. trois parcours distincts : CSP, carte de résident et naturalisation ;
2. un examen blanc conforme à une blueprint 40 questions / 45 minutes / 32 bonnes réponses, dont 28 questions de connaissance et 12 mises en situation ;
3. des fiches plus pédagogiques, sourcées et datées ;
4. un compte utilisateur simple par email et mot de passe ;
5. une synchronisation sécurisée de la progression, avec fallback local ;
6. un dashboard administrateur réservé à une allowlist d’emails ;
7. une préproduction Netlify séparée de la production.

## 2. Choix d’architecture

### 2.1 Frontend

- Conserver Astro et Tailwind.
- Conserver le rendu statique pour les pages publiques.
- Ajouter des composants client légers pour l’authentification, la progression et le dashboard.
- Ajouter les dépendances Supabase officielles nécessaires.

### 2.2 Authentification et données

Utiliser Supabase :

- Supabase Auth pour email + mot de passe ;
- confirmation d’email activée ;
- récupération de mot de passe ;
- PostgreSQL pour profils, progression, tentatives, signalements et métadonnées administratives ;
- Row Level Security sur toutes les tables utilisateur ;
- aucune clé `service_role` exposée au navigateur.

### 2.3 Autorisation administrateur

L’accès administrateur est défendu sur deux niveaux :

1. garde côté interface : l’utilisateur non autorisé est redirigé ;
2. contrôle serveur : chaque Netlify Function vérifie le JWT Supabase, puis compare l’email à `ADMIN_EMAILS`.

La liste des administrateurs est une variable d’environnement côté Netlify, jamais codée en dur. Le rôle admin n’est donc pas accordé par une valeur modifiable depuis le navigateur.

### 2.4 Netlify Functions

Créer des fonctions pour les opérations privilégiées :

- `admin-overview` : métriques globales ;
- `admin-users` : liste paginée des utilisateurs ;
- `admin-content-status` : état de vérification des contenus ;
- `admin-reports` : consultation et résolution des signalements.

Toutes ces fonctions exigent un Bearer token valide et un email présent dans `ADMIN_EMAILS`.

## 3. Préproduction

### 3.1 Isolation Git

- `main` reste la branche de production.
- Tous les changements sont réalisés sur `feat/preprod-auth-admin-learning-platform`.
- Une pull request reste en draft tant que la recette n’est pas terminée.
- Aucun merge automatique.

### 3.2 Isolation Netlify

Créer un site Netlify séparé, lié à la branche de feature, avec :

- nom dédié de préproduction ;
- variables Supabase de préproduction ;
- `ADMIN_EMAILS` ;
- `PUBLIC_APP_ENV=preprod` ;
- bannière visible « Préproduction » ;
- indexation désactivée (`noindex`) ;
- URL de callback Supabase limitée à la préproduction.

La préproduction n’utilise pas les variables ni la base de production.

## 4. Modèle de données

### 4.1 `profiles`

- `id uuid primary key references auth.users` ;
- `email text` ;
- `display_name text` ;
- `selected_path text check in ('csp','resident','naturalisation')` ;
- `created_at timestamptz` ;
- `updated_at timestamptz`.

RLS : un utilisateur peut lire et modifier uniquement son profil.

### 4.2 `learning_progress`

- `user_id uuid` ;
- `path_slug text` ;
- `module_slug text` ;
- `mastery integer` ;
- `wrong_concepts jsonb` ;
- `next_review_at timestamptz` ;
- `last_attempt_at timestamptz` ;
- clé primaire composite `(user_id, path_slug, module_slug)`.

RLS : accès limité au propriétaire.

### 4.3 `exam_attempts`

- `id uuid` ;
- `user_id uuid` ;
- `path_slug text` ;
- `score integer` ;
- `total integer` ;
- `duration_seconds integer` ;
- `breakdown jsonb` ;
- `created_at timestamptz`.

RLS : accès limité au propriétaire.

### 4.4 `content_reports`

- `id uuid` ;
- `user_id uuid nullable` ;
- `page_path text` ;
- `message text` ;
- `status text` ;
- `created_at timestamptz` ;
- `resolved_at timestamptz nullable`.

Insertion autorisée aux utilisateurs connectés. Lecture et modification réservées aux fonctions admin.

## 5. Parcours pédagogiques

### 5.1 Choix du parcours

Ajouter `/choisir-mon-parcours` avec trois cartes :

- carte de séjour pluriannuelle ;
- carte de résident ;
- naturalisation.

Le choix est enregistré localement pour les visiteurs et synchronisé dans `profiles.selected_path` pour les utilisateurs connectés.

### 5.2 Métadonnées des contenus

Étendre les frontmatters avec :

- `officialTheme` ;
- `examMentions` ;
- `lastReviewedAt` ;
- `sources` ;
- `concepts` ;
- `difficultyByPath`.

### 5.3 Fiches

Chaque fiche affiche :

- thème officiel et module ;
- temps de lecture ;
- résumé « à retenir en 30 secondes » ;
- notions détaillées ;
- exemples concrets ;
- pièges fréquents ;
- mini-récapitulatif ;
- sources officielles ;
- date de dernière vérification ;
- navigation précédent/suivant ;
- bouton de signalement ;
- quiz complet.

Les blocs affiliés sont retirés des fiches pédagogiques et regroupés sur une page dédiée aux ressources.

### 5.4 Lisibilité

- Remplacer les formes avec point médian par des formulations neutres simples.
- Garder les phrases courtes et le vocabulaire A2/B1 pour les parcours concernés.
- Afficher explicitement les exigences linguistiques propres à chaque démarche sans les confondre avec le niveau de lecture du site.

## 6. Examen blanc

### 6.1 Blueprint

Le générateur doit garantir :

```ts
{
  total: 40,
  durationSeconds: 2700,
  passingScore: 32,
  knowledge: 28,
  situations: 12
}
```

Les questions sont filtrées par parcours, réparties sur les cinq thèmes officiels, puis mélangées.

### 6.2 Validation des données

Ajouter des tests garantissant :

- identifiants uniques ;
- quatre choix par question ;
- réponse valide ;
- `questionType` défini ;
- parcours autorisés définis ;
- source renseignée ;
- répartition correcte de l’examen blanc.

## 7. Compte utilisateur

Pages :

- `/connexion` ;
- `/inscription` ;
- `/mot-de-passe-oublie` ;
- `/reinitialiser-mot-de-passe` ;
- `/mon-espace`.

Fonctions :

- inscription email + mot de passe ;
- confirmation d’email ;
- connexion et déconnexion ;
- récupération de mot de passe ;
- affichage de la progression ;
- historique des examens ;
- thèmes faibles ;
- prochaines révisions ;
- suppression du compte via procédure sécurisée à implémenter dans une phase dédiée si nécessaire.

Le site reste utilisable sans compte. La création de compte sert à synchroniser la progression entre appareils.

## 8. Dashboard administrateur

Route : `/admin`.

Fonctions MVP :

- indicateurs : utilisateurs, inscriptions récentes, examens passés, score moyen ;
- liste paginée des utilisateurs ;
- état des contenus : dernière vérification, sources manquantes, contenus expirés ;
- signalements utilisateur avec statut ;
- liens rapides vers les pages à corriger.

Le dashboard ne contient aucune opération destructive dans cette première version.

## 9. Sécurité

- JWT vérifié côté serveur sur chaque fonction admin ;
- allowlist `ADMIN_EMAILS` côté serveur ;
- RLS activée sur chaque table ;
- `SUPABASE_SERVICE_ROLE_KEY` uniquement dans Netlify Functions ;
- CSP ajoutée après auto-hébergement des polices ;
- rate limiting simple sur les fonctions sensibles ;
- aucune information indiquant si un email est administrateur lors de la connexion ;
- messages d’erreur génériques côté utilisateur, détails uniquement dans les logs ;
- dépendances auditées ;
- préproduction en `noindex`.

## 10. Tests et recette

### Tests automatisés

- tests unitaires pour blueprint, scoring, sélection de questions et progression ;
- tests de validation des fichiers de contenu ;
- tests des helpers d’autorisation ;
- tests de build Astro ;
- vérification TypeScript ;
- tests E2E des parcours connexion, quiz, examen et accès admin interdit.

### Recette préproduction

- inscription ;
- confirmation ;
- connexion ;
- synchronisation de progression ;
- récupération de mot de passe ;
- compte standard refusé sur `/admin` ;
- compte allowlisté autorisé ;
- examen blanc conforme ;
- mobile 390 px ;
- navigation clavier ;
- audit Lighthouse ;
- contrôle des headers et de l’indexation.

## 11. Critères de succès

- aucun commit sur `main` ;
- préproduction accessible sur une URL distincte ;
- inscription et connexion fonctionnelles ;
- admin impossible pour un utilisateur standard, même en appelant directement l’API ;
- progression locale conservée et synchronisée après connexion ;
- examen blanc respectant exactement la blueprint ;
- build, typecheck et tests verts ;
- pull request créée en draft, non mergée.

## 12. Hors périmètre immédiat

- paiement ;
- application mobile native ;
- édition complète des questions depuis l’admin ;
- modération multi-admin complexe ;
- import automatique de banques officielles ;
- migration de la production avant validation de la préproduction.
