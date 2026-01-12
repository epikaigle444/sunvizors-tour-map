# The Sunvizors - Carte de Vote interactive

**Site Officiel :** [https://map.thesunvizors.com](https://map.thesunvizors.com)

## 📖 Le Concept
Cette application est une carte interactive dédiée aux fans du groupe **The Sunvizors**. Pour préparer leur tournée 2026, le groupe a décidé de donner la parole à son public. Les fans peuvent explorer la carte, cliquer sur leur ville (ou la plus proche) et voter pour demander un concert.

L'objectif est de permettre au groupe et à sa production d'identifier les zones géographiques où la demande est la plus forte, afin de construire une tournée au plus près de sa communauté. Chaque vote peut être accompagné d'une proposition de salle de concert et d'un message personnel pour le groupe.

## 🚀 Aperçu Technique

- **Frontend :** React avec Vite, Tailwind CSS pour le design, et Framer Motion pour des animations fluides.
- **Backend :** API PHP native optimisée pour l'hébergement mutualisé (LWS).
- **Base de données :** MySQL pour le stockage sécurisé des votes et des contacts.
- **Fonctionnalités clés :** 
  - Protection anti-robot (Honeypot invisible, limitation par IP).
  - Dashboard Admin complet pour visualiser et gérer les votes.
  - Exportation des données au format CSV (compatible Excel).
  - Partage social optimisé (Facebook, X, WhatsApp).

## 📁 Structure du Projet

- `/frontend` : Code source React (l'interface utilisateur).
- `/backend` : Scripts PHP de l'API (gestion des données).
- `/dist-production` : Version compilée et prête à être envoyée sur le serveur LWS.
- `database.sql` : Schéma de la base de données à importer.

## 🛠 Installation et Déploiement

### Frontend (Développement)
1. `cd frontend`
2. `npm install` (pour installer les dépendances)
3. `npm run dev` (pour lancer le serveur local)
4. `npm run build` (pour générer la version de production)

### Backend & Mise en ligne
1. Téléchargez le contenu de `/dist-production` sur votre serveur FTP.
2. Importez le fichier `database.sql` dans votre base de données MySQL via phpMyAdmin.
3. Configurez le fichier `api/db.php` avec vos identifiants de connexion (un modèle `db.sample.php` est disponible dans le dossier backend).

## 🔒 Sécurité
- Requêtes SQL protégées contre les injections via PDO.
- Système de "Honeypot" pour bloquer les formulaires remplis par des robots.
- Limitation de débit (Rate Limiting) : maximum 5 votes toutes les 10 minutes par adresse IP.
- Accès à l'administration protégé par mot de passe.

---
*Projet développé pour la promotion de la tournée 2026 de **The Sunvizors**.*