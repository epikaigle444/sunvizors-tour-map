# The Sunvizors Tour Map

Carte interactive de vote pour la tournée du groupe **The Sunvizors**.
Application Full-Stack (React + FastAPI + MongoDB).

## Architecture
*   **Frontend :** React, Leaflet (Carte), Tailwind CSS (Design Noir & Or).
*   **Backend :** Python FastAPI (Monolithique).
*   **Base de données :** MongoDB (Stockage des votes et contacts).

## Prérequis
*   Node.js 18+
*   Python 3.9+
*   MongoDB 6.0+ (Doit être installé et lancé)

## Installation & Lancement Rapide

### 1. Base de données (MongoDB)
Vérifiez que MongoDB tourne :
```bash
sudo systemctl status mongod
# Si éteint : sudo systemctl start mongod
```

### 2. Backend (API)
Le backend gère les votes et l'export CSV.
```bash
cd sunvizors-tour-map/backend
source venv/bin/activate
# Lancer le serveur
uvicorn main:app --reload
```
L'API sera sur : `http://localhost:8000`

### 3. Frontend (Carte)
Le site web visible par les utilisateurs.
```bash
cd sunvizors-tour-map/frontend
# Lancer le site
npm run dev
```
Le site sera sur : `http://localhost:5173`

## Fonctionnalités Clés
1.  **Vote Fan :**
    *   Clic sur une ville -> Email (Étape 1).
    *   Formulaire détaillé (Nom, Tel, Salle, Message) (Étape 2).
2.  **Carte Intelligente :**
    *   Les noms des villes apparaissent au zoom.
    *   Top 5 affiché en permanence sur la carte.
3.  **Administration :**
    *   Accès via le bouton "ADMIN" (haut-droite) ou `Ctrl+Shift+A`.
    *   Vue de **toutes** les villes.
    *   **Détails :** Cliquez sur une ville pour voir la liste des votants.
    *   **Export :** Bouton "EXPORTER CSV" pour récupérer toutes les données.

## Commandes Utiles
Si les serveurs ne répondent plus, tuez les processus et relancez :
```bash
pkill -f uvicorn
pkill -f "npm run dev"
```