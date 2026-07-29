# Activation de la préproduction

Ce document décrit l’activation de l’authentification, de la synchronisation et du dashboard administrateur sur le Deploy Preview Netlify. Aucun secret ne doit être ajouté au dépôt Git.

## 1. État actuel

- Branche : `feat/preprod-auth-admin-learning-platform`
- Pull request : draft, sans fusion automatique
- Environnement Netlify : Deploy Preview du PR
- Pages privées : `noindex`
- Base de données : migration prête, mais projet Supabase à créer ou à connecter

## 2. Créer le projet Supabase de préproduction

Créer un projet distinct de toute future production, de préférence dans la région `eu-west-3`.

Nom recommandé :

```text
examencivique-preprod
```

Ne pas réutiliser une base de production et ne pas importer de données personnelles réelles.

## 3. Appliquer le schéma

Appliquer le fichier suivant avec Supabase CLI ou l’éditeur SQL du projet :

```text
supabase/migrations/202607290001_auth_learning_admin.sql
```

Le schéma crée :

- `profiles` ;
- `learning_progress` ;
- `exam_attempts` ;
- `content_reports` ;
- les politiques RLS associées.

Après application, exécuter les Security Advisors Supabase et corriger toute alerte bloquante avant les tests utilisateurs.

## 4. Configurer Supabase Auth

Dans Authentication → Providers → Email :

- activer Email + Password ;
- exiger la confirmation de l’adresse email ;
- désactiver les inscriptions anonymes ;
- conserver la protection contre les mots de passe compromis si elle est disponible sur le plan utilisé.

Ajouter les URL autorisées :

```text
https://deploy-preview-4--examenciviquefrsa.netlify.app/connexion
https://deploy-preview-4--examenciviquefrsa.netlify.app/mon-espace
https://deploy-preview-4--examenciviquefrsa.netlify.app/admin
```

La future URL de production ne doit être ajoutée qu’au moment de la mise en production.

## 5. Variables Netlify

Ajouter les variables dans le contexte **Deploy Previews**, jamais dans Git.

### Variables publiques

```text
PUBLIC_APP_ENV=preprod
PUBLIC_SITE_URL=https://deploy-preview-4--examenciviquefrsa.netlify.app
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

### Variables serveur uniquement

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<secret-service-role-key>
ADMIN_EMAILS=<adresse-email-du-proprietaire>
```

Règles obligatoires :

- `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais commencer par `PUBLIC_` ;
- ne jamais copier cette clé dans une page Astro ou un script navigateur ;
- `ADMIN_EMAILS` contient une liste séparée par des virgules ;
- pour un seul administrateur, renseigner une seule adresse exacte et confirmée.

## 6. Créer le compte administrateur

1. Ouvrir `/connexion` sur le Deploy Preview.
2. Créer le compte avec l’adresse présente dans `ADMIN_EMAILS`.
3. Confirmer l’adresse depuis l’email reçu.
4. Se connecter.
5. Ouvrir `/admin`.

Une adresse absente de l’allowlist reçoit une réponse HTTP `403`, même si elle possède un compte valide.

## 7. Recette P0

### Comptes

- inscription avec email valide ;
- refus d’un mot de passe trop court ;
- confirmation d’email ;
- connexion et déconnexion ;
- récupération du mot de passe ;
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

## 8. Conditions avant fusion

La pull request reste en draft tant que les éléments suivants ne sont pas validés :

- CI GitHub verte ;
- Deploy Preview Netlify vert ;
- projet Supabase de préproduction actif ;
- tests d’inscription et de connexion réussis ;
- contrôle RLS réussi avec deux comptes distincts ;
- accès admin testé avec un compte autorisé et un compte refusé ;
- aucune donnée de test sensible conservée.

Aucune fusion vers `main` ne doit être effectuée automatiquement.
