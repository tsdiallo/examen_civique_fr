# Activation de la préproduction

Ce document décrit l’activation de l’authentification, de la synchronisation et du dashboard administrateur sur Netlify. Aucun secret ne doit être ajouté au dépôt Git.

## 1. État actuel

- Branche : `feat/preprod-auth-admin-learning-platform`
- Pull request : draft, sans fusion automatique
- Site Netlify : `https://preprodexam.netlify.app`
- Projet Supabase : `examencivique-preprod`
- Référence Supabase : `rjiubwkmiklnmcfozhii`
- Région : `eu-west-3` (Paris)
- API Supabase : `https://rjiubwkmiklnmcfozhii.supabase.co`
- Pages privées : `noindex`
- Coût du projet Supabase : `0 € / mois` au moment de sa création

Le projet Supabase est actif. Les migrations suivantes ont été appliquées :

```text
supabase/migrations/202607290001_auth_learning_admin.sql
supabase/migrations/202607290002_content_reports_user_index.sql
```

Les quatre tables exposées ont la RLS activée. Les Security Advisors Supabase ne remontent aucune alerte de sécurité.

## 2. Schéma actif

Le schéma contient :

- `profiles` ;
- `learning_progress` ;
- `exam_attempts` ;
- `content_reports` ;
- les politiques RLS associées ;
- le déclencheur de création automatique du profil ;
- les index de lecture et de propriété.

Les utilisateurs authentifiés ne peuvent lire ou modifier que leurs propres données. Les opérations administrateur restent exclusivement côté serveur.

## 3. Configurer Supabase Auth

Cette étape doit être terminée dans le tableau de bord Supabase.

### Authentication → URL Configuration

Configurer :

```text
Site URL
https://preprodexam.netlify.app
```

Ajouter les Redirect URLs suivantes :

```text
https://preprodexam.netlify.app/**
https://**--preprodexam.netlify.app/**
http://localhost:4321/**
```

Le motif Netlify autorise les Deploy Previews et les Branch Deploys. Pour une future production, préférer des URL exactes plutôt qu’un wildcard.

### Authentication → Providers → Email

Vérifier les réglages suivants :

- Email + Password activé ;
- confirmation de l’adresse email activée ;
- inscriptions anonymes désactivées ;
- longueur minimale du mot de passe cohérente avec l’interface : 10 caractères ou plus ;
- protection contre les mots de passe compromis activée lorsqu’elle est disponible.

## 4. Variables Netlify

Les variables suivantes sont déjà configurées sur le projet Netlify `preprodexam` :

```text
PUBLIC_APP_ENV=preprod
PUBLIC_SITE_URL=https://preprodexam.netlify.app
PUBLIC_SUPABASE_URL=https://rjiubwkmiklnmcfozhii.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<clé publique configurée>
SUPABASE_URL=https://rjiubwkmiklnmcfozhii.supabase.co
SUPABASE_PUBLISHABLE_KEY=<clé publique configurée>
```

Deux variables secrètes restent à ajouter manuellement dans Netlify :

```text
SUPABASE_SERVICE_ROLE_KEY=<clé secrète service_role du projet>
ADMIN_EMAILS=<adresse email exacte de l’administrateur>
```

### Où récupérer la clé service_role

Dans Supabase :

1. ouvrir le projet `examencivique-preprod` ;
2. ouvrir **Project Settings → API Keys** ;
3. afficher la clé secrète ou `service_role` ;
4. la copier sans la partager dans un message ou un fichier Git.

Dans Netlify :

1. ouvrir le projet `preprodexam` ;
2. ouvrir **Project configuration → Environment variables** ;
3. créer `SUPABASE_SERVICE_ROLE_KEY` ;
4. choisir les scopes **Functions** et **Runtime** ;
5. marquer la valeur comme secrète ;
6. créer `ADMIN_EMAILS` avec l’adresse exacte du compte administrateur ;
7. relancer un déploiement.

Règles obligatoires :

- `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais commencer par `PUBLIC_` ;
- ne jamais copier cette clé dans une page Astro, un script navigateur ou GitHub ;
- `ADMIN_EMAILS` contient une liste séparée par des virgules ;
- pour un seul administrateur, renseigner une seule adresse exacte et confirmée.

## 5. Créer le compte administrateur

1. Ouvrir `https://preprodexam.netlify.app/connexion`.
2. Choisir **Créer un compte**.
3. Utiliser l’adresse présente dans `ADMIN_EMAILS`.
4. Confirmer l’adresse depuis l’email reçu.
5. Se connecter.
6. Ouvrir `/admin`.

Une adresse absente de l’allowlist reçoit une réponse HTTP `403`, même si elle possède un compte valide.

## 6. Recette fonctionnelle

### Comptes

- inscription avec email valide ;
- refus d’un mot de passe trop court ;
- réception et ouverture de l’email de confirmation ;
- connexion et déconnexion ;
- récupération et modification du mot de passe ;
- redirection uniquement vers une route locale.

### Données utilisateur

- un utilisateur ne lit que son profil ;
- un utilisateur ne lit que sa progression ;
- un utilisateur ne lit que ses examens ;
- une tentative d’accès à l’identifiant d’un autre utilisateur échoue.

### Administration

- le compte allowlisté accède aux statistiques ;
- un autre compte reçoit `403` ;
- une requête sans JWT reçoit `401` ;
- la liste des signalements s’affiche ;
- les actions « résolu » et « rejeté » fonctionnent ;
- aucune clé privilégiée n’apparaît dans les sources du navigateur.

### Parcours et examen

- sélection CSP, carte de résident et naturalisation ;
- génération de 40 questions ;
- présence de 28 connaissances et 12 mises en situation ;
- chronomètre de 45 minutes ;
- score local sans compte ;
- synchronisation avec un compte ;
- dashboard utilisateur mis à jour après un quiz et un examen.

## 7. Conditions avant fusion

La pull request reste en draft tant que les éléments suivants ne sont pas validés :

- CI GitHub verte ;
- déploiement Netlify vert ;
- inscription et connexion réussies sur `preprodexam.netlify.app` ;
- contrôle RLS réussi avec deux comptes distincts ;
- accès admin testé avec un compte autorisé et un compte refusé ;
- aucune donnée de test sensible conservée.

Aucune fusion vers `main` ne doit être effectuée automatiquement.
