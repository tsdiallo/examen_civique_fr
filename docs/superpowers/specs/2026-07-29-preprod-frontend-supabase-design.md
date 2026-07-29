# Refonte frontend et activation Supabase — conception

## Objectif

Transformer la préproduction en une plateforme d’apprentissage crédible, claire et moderne, avec un compte email/mot de passe, une progression synchronisée et un espace administrateur sécurisé.

## Direction visuelle

La direction retenue combine un **service public moderne** et une **plateforme d’apprentissage dynamique** :

- bleu institutionnel dominant ;
- rouge réservé aux alertes et accents ;
- cartes aérées et contrastées ;
- typographie système rapide et lisible ;
- hiérarchie visuelle forte ;
- interfaces mobiles prioritaires ;
- aucun effet visuel au détriment de l’accessibilité.

## Écrans concernés

### Connexion

- mise en page en deux zones sur écran large ;
- bénéfices du compte et garanties de confidentialité à gauche ;
- formulaire de connexion/création de compte à droite ;
- états d’erreur, de succès et de chargement visibles ;
- réinitialisation du mot de passe ;
- version mobile en une seule colonne.

### Mon espace

- en-tête personnalisé avec adresse email et action de déconnexion ;
- carte de parcours sélectionné ;
- indicateurs de progression plus lisibles ;
- progression par thème avec barres et recommandations ;
- prochaine action prioritaire ;
- état vide utile pour les nouveaux comptes.

### Parcours

- comparaison claire des trois démarches ;
- hiérarchie entre niveau, objectif et appel à l’action ;
- meilleure distinction visuelle de la carte sélectionnée ;
- fonctionnement cohérent avec le stockage local et Supabase.

### Navigation

- navigation compacte ;
- état actif ;
- accès au compte visible ;
- menu mobile accessible au clavier ;
- cohérence entre pages publiques, compte et administration.

## Architecture Supabase

- projet dédié : `examencivique-preprod` ;
- région : `eu-west-3` ;
- authentification email/mot de passe ;
- confirmation d’adresse email ;
- tables `profiles`, `learning_progress`, `exam_attempts`, `content_reports` ;
- RLS activée sur toutes les tables exposées ;
- politiques limitées aux lignes appartenant à `auth.uid()` ;
- opérations administrateur uniquement côté serveur ;
- clé `service_role` jamais exposée au navigateur ;
- allowlist d’emails administrateurs via `ADMIN_EMAILS`.

## Flux de données

1. L’utilisateur crée un compte et confirme son email.
2. Supabase Auth crée automatiquement son profil.
3. Le navigateur utilise uniquement la clé publique Supabase.
4. Les requêtes de progression sont filtrées par RLS.
5. Les fonctions Netlify vérifient le JWT avant toute opération admin.
6. Les fonctions vérifient ensuite l’adresse email dans `ADMIN_EMAILS`.
7. La clé `service_role` reste uniquement dans les variables secrètes Netlify.

## Gestion des erreurs

- message clair lorsque Supabase n’est pas configuré ;
- redirection vers la connexion si la session est absente ;
- messages non techniques pour l’utilisateur ;
- détails conservés uniquement dans la console ou les journaux serveur ;
- aucune donnée sensible dans le HTML ou les erreurs publiques.

## Vérification

- validation SQL de la migration ;
- tests RLS avec deux utilisateurs distincts ;
- test création/confirmation/connexion/déconnexion ;
- test réinitialisation du mot de passe ;
- test synchronisation progression et examens ;
- test refus de l’administration pour un utilisateur non autorisé ;
- typecheck, tests unitaires et build Astro ;
- vérification du déploiement Netlify avant toute fusion.

## Contraintes

- aucune modification de `main` ;
- PR conservée en brouillon ;
- aucune fusion en production sans validation explicite ;
- aucun secret commité dans GitHub ;
- préproduction indexée en `noindex` ;
- interface en français clair, niveau A2/B1 autant que possible.
