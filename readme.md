# NODE-PRO Mobile

NODE-PRO Mobile est une application full-stack pour la gestion d'articles et d'inventaire, proposant des interfaces web et mobile. Le projet est construit avec une architecture de microservices, utilisant Node.js pour le backend, et implémente des mises à jour en temps réel via WebSockets.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Gestion des articles (création, lecture, mise à jour, suppression)
- Mises à jour en temps réel via WebSockets
- Téléchargement et gestion des images
- Interface web responsive
- Interface mobile conviviale
- Support du mode sombre (mobile)
- Fonctionnalité de recherche

## Stack Technologique

### Backend

- Node.js
- Express.js
- MongoDB avec Mongoose
- WebSocket (bibliothèque ws)
- JWT pour l'authentification
- Multer pour le téléchargement de fichiers
- Sharp pour le traitement d'images

### Frontend Web

- HTML5
- CSS3
- JavaScript Vanilla
- API Fetch pour les requêtes HTTP

### Frontend Mobile

- React Native avec Expo
- React Navigation
- Axios pour les appels API
- Expo SecureStore pour le stockage des tokens
- Expo ImagePicker pour la sélection d'images

## Installation

### Prérequis

- Node.js (v14 ou ultérieur)
- npm ou yarn
- MongoDB
- Expo CLI (pour le développement mobile)

### Configuration du Backend

1. Clonez le dépôt :

   ```
   git clone https://github.com/votre-nom-utilisateur/node-pro-mobile.git
   cd node-pro-mobile
   ```

2. Installez les dépendances du backend :

   ```
   cd backend
   npm install
   ```

3. Créez un fichier `.env` dans le répertoire `backend` avec le contenu suivant :

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nodepro
   JWT_SECRET=votre_secret_jwt
   ```

4. Démarrez le serveur backend :
   ```
   npm start
   ```

### Configuration du Frontend Web

1. Naviguez vers le répertoire du frontend web :

   ```
   cd ../frontend/web
   ```

2. Installez les dépendances :

   ```
   npm install
   ```

3. Mettez à jour le fichier `public/js/config.js` avec l'URL de votre serveur backend si nécessaire.

4. Démarrez le serveur web :

   ```
   npm start
   ```

5. Ouvrez votre navigateur et visitez `http://localhost:8080` (ou le port spécifié par votre serveur web).

### Configuration du Frontend Mobile

1. Naviguez vers le répertoire du frontend mobile :

   ```
   cd ../mobile/mobile-pro
   ```

2. Installez les dépendances :

   ```
   npm install
   ```

3. Mettez à jour le fichier `src/config/config.js` avec l'adresse IP de votre serveur backend.

4. Démarrez le serveur de développement Expo :

   ```
   npx expo start
   ```

5. Utilisez l'application Expo Go sur votre appareil mobile pour scanner le code QR et exécuter l'application.

## Utilisation

### Application Web

1. Ouvrez l'application web dans votre navigateur.
2. Inscrivez-vous pour un nouveau compte ou connectez-vous avec des identifiants existants.
3. Utilisez les boutons de navigation pour visualiser, créer, éditer ou supprimer des articles.
4. Profitez des mises à jour en temps réel sur tous les clients connectés.

### Application Mobile

1. Ouvrez l'application mobile en utilisant Expo Go.
2. Inscrivez-vous pour un nouveau compte ou connectez-vous avec des identifiants existants.
3. Naviguez dans l'application en utilisant la barre de navigation inférieure.
4. Visualisez, créez, éditez ou supprimez des articles selon vos besoins.
5. Utilisez la fonctionnalité de recherche pour trouver des articles spécifiques.
6. Basculez entre les modes clair et sombre dans la section profil.

## Structure du Projet

```
node-pro-mobile/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── web/
│   │   ├── public/
│   │   │   ├── js/
│   │   │   ├── index.html
│   │   │   └── style.css
│   │   └── package.json
│   └── mobile/
│       └── mobile-pro/
│           ├── src/
│           │   ├── components/
│           │   ├── screens/
│           │   ├── services/
│           │   ├── navigation/
│           │   └── config/
│           ├── App.js
│           └── app.json
└── README.md
```

## Principaux Modèles de Conception et Algorithmes

1. **Architecture MVC** : Le projet suit un modèle Modèle-Vue-Contrôleur, en particulier dans la structure du backend.

2. **Modèle Observateur** : Implémenté via WebSockets pour les mises à jour en temps réel.

3. **Modèle Singleton** : Utilisé dans la connexion à la base de données et l'initialisation du serveur WebSocket.

4. **Modèle Factory** : Employé dans la création d'instances de services API.

5. **Authentification JWT** : Assure une authentification et une autorisation sécurisées des utilisateurs.

6. **Conception API RESTful** : Le backend fournit une API RESTful pour les opérations CRUD sur les articles.

7. **Algorithme de Debounce** : Implémenté dans la fonctionnalité de recherche pour optimiser les performances.

8. **Chargement Paresseux** : Utilisé dans l'application mobile pour un chargement et un rendu efficaces des images.

## Contribution

Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails sur notre code de conduite et le processus de soumission des pull requests.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.
