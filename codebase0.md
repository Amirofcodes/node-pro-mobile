# •aidigestignore

```
.db
svelte-kit
build-*
ios
android
modules/
parse-skdocs.cjs
sk.json

```

# readme.md

```md
# NODE-PRO Mobile

## Description du Projet

Ce projet est une version mobile de l'application web NODE-PRO, développée avec React Native. Il vise à offrir une expérience mobile fluide tout en maintenant une synchronisation avec la version web grâce à une architecture de microservices.

## C4 Diagram

Here's a high-level C4 diagram of the NODE-PRO Mobile system:

\`\`\`mermaid
graph TD
    subgraph "System Context"
        U[User] -->|Uses| MM[NODE-PRO Mobile]
        MM -->|Uses| DB[(MongoDB)]
    end

    subgraph "Container View"
        MM -->|Contains| MF[Mobile Frontend]
        MM -->|Contains| BE[Backend Services]
        BE -->|Uses| DB
        MF <-->|WebSocket| BE
    end

    subgraph "Component View"
        MF -->|Contains| AR[Article Management]
        MF -->|Contains| UM[User Management]
        MF -->|Contains| IS[Image Storage]
        BE -->|Contains| AS[Authentication Service]
        BE -->|Contains| ARS[Article Service]
        BE -->|Contains| US[User Service]
        BE -->|Contains| WS[WebSocket Service]
    end
\`\`\`

## Design Patterns

The project utilizes several design patterns:

1. **MVC (Model-View-Controller)**: The backend follows an MVC pattern, with models representing data structures, controllers handling business logic, and views (in this case, API responses) presenting data.

2. **Repository Pattern**: Used in the backend to abstract data access logic, making it easier to switch between different data sources if needed.

3. **Observer Pattern**: Implemented through WebSockets for real-time updates, allowing clients to be notified of changes in the system.

4. **Singleton Pattern**: Used for database connection and WebSocket server to ensure a single instance is shared across the application.

5. **Middleware Pattern**: Employed in Express.js for authentication, error handling, and request processing.

## Technology Stack

- **Frontend**:

  - React Native
  - Expo (for easier development and testing)
  - WebSocket client for real-time communication

- **Backend**:

  - Node.js
  - Express.js
  - MongoDB (with Mongoose ODM)
  - WebSocket (ws library)
  - JSON Web Tokens (JWT) for authentication

- **DevOps**:
  - Git for version control
  - npm for package management

## Objectifs Clés

1. Maintenir la parité des fonctionnalités avec la version web
2. Assurer la cohérence des données entre les plateformes
3. Optimiser l'expérience utilisateur mobile
4. Mettre en place une gestion efficace de l'état de l'application
5. Utiliser les meilleures pratiques de React Native et Expo

## Phases de Développement Prévues

1. Mise en place de la structure du projet React Native
2. Adaptation du backend à l'architecture microservices
3. Implémentation de l'authentification des utilisateurs dans l'app mobile
4. Développement des fonctionnalités de gestion des articles
5. Intégration de la synchronisation en temps réel
6. Implémentation de la fonctionnalité de scan de code-barres
7. Optimisation des performances et de l'interface utilisateur
8. Tests approfondis et débogage

## Défis à Relever

- Gestion efficace de l'état dans React Native
- Implémentation d'une authentification sécurisée dans un environnement mobile
- Assurer une synchronisation en temps réel fluide entre les versions web et mobile
- Optimisation des performances de l'application et réduction des temps de chargement
- Gestion du mode hors ligne et persistance des données

## Mises à Jour Récentes

1. Implémentation de la fonctionnalité de téléchargement et de stockage d'images pour les articles.
2. Refactorisation du backend pour utiliser une architecture de microservices.
3. Ajout du support WebSocket pour les mises à jour en temps réel.
4. Mise à jour du frontend pour gérer les téléchargements et l'affichage des images.
5. Amélioration de la gestion des erreurs et de la journalisation dans toute l'application.

## Prochaines Étapes

1. Implémenter le support hors ligne pour l'application mobile.
2. Ajouter des tests unitaires et d'intégration pour le frontend et le backend.
3. Implémenter une couche de mise en cache pour améliorer les performances.
4. Renforcer les mesures de sécurité, y compris la limitation de débit et la validation des entrées.
5. Développer un pipeline CI/CD pour l'automatisation des tests et du déploiement.

## À Propos

Ce projet est une extension de l'application web NODE-PRO originale, visant à fournir une solution mobile complète tout en tirant parti de l'architecture microservices pour une intégration transparente entre les plateformes web et mobile.

```

# package.json

```json
{
    "name": "node-pro-mobile",
    "version": "1.0.0",
    "description": "NODE-PRO Mobile with web and mobile frontends",
    "scripts": {
        "start:backend": "cd backend && npm start",
        "start:web": "cd frontend/web && npm start",
        "dev:backend": "cd backend && npm run dev",
        "install:all": "npm install && cd backend && npm install && cd ../frontend/web && npm install"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "ai-digest": "^1.0.4"
    }
}

```

# .gitignore

```
node_modules/
.env
*.log
.DS_Store
codebase.md
```

# backend/server.js

```js
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set('wss', wss);

const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

# backend/package.json

```json
{
  "name": "node-pro-mobile-backend",
  "version": "1.0.0",
  "description": "Backend for NODE-PRO Mobile",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/ws": "^8.5.12",
    "nodemon": "^3.1.4"
  }
}
```

# backend/db.js

```js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

# Docs/updated-project-documentation.md

```md
# NODE-PRO Mobile Project Documentation

## Project Overview

NODE-PRO Mobile is an extension of the original NODE-PRO web application, designed to provide a mobile interface for managing articles and users. The project combines a React Native frontend with a Node.js backend, utilizing a microservices architecture and real-time WebSocket communication.

## Current Project State

### Backend Development

1. **Server Setup**:
   - Implemented Express.js server with proper middleware configuration.
   - Integrated WebSocket for real-time updates.
   - Implemented CORS handling for cross-origin requests.

2. **Database Connection**:
   - Set up MongoDB connection with error handling and logging.
   - Implemented connection pooling for improved performance.

3. **Authentication**:
   - Implemented JWT-based authentication.
   - Created routes for user registration and login.
   - Developed middleware for protecting routes.

4. **Article Management**:
   - Implemented CRUD operations for articles.
   - Added search functionality for articles.
   - Integrated image upload and processing for articles.

5. **Real-time Updates**:
   - Implemented WebSocket server for real-time communication.
   - Set up broadcasting for article updates, creations, and deletions.

6. **Error Handling and Logging**:
   - Implemented comprehensive error handling throughout the backend.
   - Added logging for important operations and errors.

### Frontend Web Development

1. **Project Structure**:
   - Organized frontend code into modular components.
   - Implemented proper separation of concerns (auth, articles, UI).

2. **Authentication**:
   - Developed login and registration functionality.
   - Implemented token-based authentication with local storage.

3. **Article Management**:
   - Created interfaces for viewing, creating, editing, and deleting articles.
   - Implemented image upload and display for articles.

4. **Search Functionality**:
   - Developed a search interface for finding articles by code.

5. **Real-time Updates**:
   - Integrated WebSocket client for receiving real-time updates.

6. **UI/UX**:
   - Implemented responsive design for various screen sizes.
   - Created intuitive navigation between different sections of the app.

### Code Refactoring and Optimization

1. **Backend**:
   - Refactored routes for improved modularity.
   - Optimized database queries for better performance.

2. **Frontend**:
   - Reorganized JavaScript files for better maintainability.
   - Implemented error handling and user feedback mechanisms.

## Next Steps

1. **React Native Mobile Frontend**:
   - Set up React Native project structure.
   - Implement authentication screens (login, register).
   - Develop article management screens (list, detail, create, edit).
   - Integrate with backend API.
   - Implement real-time updates using WebSocket.

2. **Backend Enhancements**:
   - Implement data validation and sanitization.
   - Enhance error handling and logging.
   - Optimize database queries and indexes.

3. **Testing**:
   - Develop unit tests for backend services.
   - Implement integration tests for API endpoints.
   - Create end-to-end tests for critical user flows.

4. **Documentation**:
   - Update API documentation.
   - Create user guide for web and mobile applications.

5. **Deployment**:
   - Set up CI/CD pipeline.
   - Prepare staging and production environments.

## Technical Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, WebSocket
- **Frontend Web**: HTML, CSS, JavaScript (ES6+)
- **Frontend Mobile**: React Native (upcoming)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer, Sharp for image processing
- **Real-time Communication**: WebSocket (ws library)

## API Endpoints

### Authentication
- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login user

### Articles
- GET `/api/articles`: Fetch all articles
- GET `/api/articles/:id`: Fetch a specific article
- POST `/api/articles`: Create a new article
- PUT `/api/articles/:id`: Update an existing article
- DELETE `/api/articles/:id`: Delete an article
- GET `/api/articles/:id/image`: Fetch article image
- GET `/api/articles/search/:codeArticle`: Search for an article by code

## WebSocket Events

- `newArticle`: Broadcast when a new article is created
- `updateArticle`: Broadcast when an article is updated
- `deleteArticle`: Broadcast when an article is deleted

## Challenges and Solutions

1. **Challenge**: Implementing real-time updates
   **Solution**: Utilized WebSocket for efficient, real-time bidirectional communication

2. **Challenge**: Handling image uploads
   **Solution**: Implemented Multer for file upload handling and Sharp for image processing

3. **Challenge**: Ensuring secure authentication
   **Solution**: Implemented JWT-based authentication with proper token management

## Future Improvements

1. Implement offline mode for mobile application
2. Enhance search functionality with filters and sorting options
3. Implement user roles and permissions
4. Add analytics and reporting features
5. Optimize performance for large datasets

This documentation provides a comprehensive overview of the current state of the NODE-PRO Mobile project, detailing the progress made in both backend and frontend development, and outlining the next steps for implementing the React Native mobile frontend.

```

# backend/services/websocket.js

```js
const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);
      // Handle incoming messages
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}

function broadcastUpdate(wss, updateType, data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: updateType, data }));
    }
  });
}

module.exports = { setupWebSocket, broadcastUpdate };
```

# frontend/web/package.json

```json
{
    "name": "node-pro-mobile-web",
    "version": "1.0.0",
    "description": "Web frontend for NODE-PRO Mobile",
    "scripts": {
      "start": "http-server public"
    },
    "dependencies": {
      "http-server": "^14.1.1"
    }
  }
```

# backend/routes/userData.js

```js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Route pour ajouter des données utilisateur (protégée par authentification)
router.post('/', auth, async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await User.findById(req.user.id);
    
    // Initialisation du tableau userData si non existant
    user.userData = user.userData || [];
    
    // Ajout des nouvelles données avec un horodatage
    user.userData.push({ name, age, timestamp: new Date() });
    await user.save();
    
    res.json({ message: 'Données reçues avec succès', data: { name, age } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour récupérer les données utilisateur (protégée par authentification)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.userData || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
```

# backend/routes/auth.js

```js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Utilisateur déjà existant' });
    }

    // Création d'un nouvel utilisateur
    user = new User({ username, password });

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();

    // Création et envoi du token JWT
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }

    // Création et envoi du token JWT
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
```

# backend/routes/articles.js

```js
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/upload');
const WebSocket = require('ws');

function broadcast(wss, data) {
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

router.post('/', auth, upload.single('image'), resizeImage, async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      image: req.file ? {
        data: req.file.buffer,
        contentType: 'image/jpeg'
      } : undefined
    };

    const article = new Article(articleData);
    await article.save();

    const broadcastArticle = { ...article.toObject(), image: article.image ? true : false };

    // Get the WebSocket server instance
    const wss = req.app.get('wss');
    broadcast(wss, { type: 'newArticle', data: broadcastArticle });

    res.status(201).json(broadcastArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const articles = await Article.find();
    const articlesWithoutImageData = articles.map(article => ({
      ...article.toObject(),
      image: article.image ? true : false
    }));
    res.json(articlesWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const articleWithoutImageData = {
      ...article.toObject(),
      image: article.image ? true : false
    };
    res.json(articleWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, upload.single('image'), resizeImage, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: 'image/jpeg'
      };
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const broadcastArticle = { ...article.toObject(), image: article.image ? true : false };
    broadcast(req.app.get('wss'), { type: 'updateArticle', data: broadcastArticle });

    res.json(broadcastArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    broadcast(req.app.get('wss'), { type: 'deleteArticle', data: { id: req.params.id } });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/image', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || !article.image) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', article.image.contentType);
    res.send(article.image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search/:codeArticle', auth, async (req, res) => {
  try {
    const article = await Article.findOne({ codeArticle: req.params.codeArticle });
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    const articleWithoutImageData = {
      ...article.toObject(),
      image: article.image ? true : false
    };
    res.json(articleWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

# backend/middleware/upload.js

```js
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `article-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
    .then(buffer => {
      req.file.buffer = buffer;
    });

  next();
};

module.exports = { upload, resizeImage };
```

# backend/middleware/auth.js

```js
const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = function(req, res, next) {
  // Récupération du token depuis le header Authorization
  const token = req.header('Authorization')?.split(' ')[1];

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajout des informations de l'utilisateur décodées à la requête
    req.user = decoded.user;
    next();
  } catch (err) {
    // En cas de token invalide, renvoyer une erreur
    res.status(401).json({ msg: 'Token non valide' });
  }
};
```

# backend/models/User.js

```js
const mongoose = require('mongoose');

// Définition du schéma pour les utilisateurs
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Tableau pour stocker les données utilisateur (fonctionnalité supplémentaire)
  userData: [{
    name: String,
    age: Number,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Exportation du modèle User basé sur le schéma UserSchema
module.exports = mongoose.model('User', UserSchema);
```

# backend/models/Article.js

```js
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  codeArticle: { type: String, required: true, unique: true },
  description: { type: String },
  image: {
    data: Buffer,
    contentType: String
  },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
```

# frontend/web/public/style.css

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    width: 80%;
    margin: auto;
    overflow: hidden;
    padding: 20px;
}

header {
    background: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
}

nav {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

button {
    background: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background: #555;
}

main {
    background: #fff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.intro-text {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    text-align: center;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background: #f4f4f4;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
}

form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
}

input, textarea {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.view-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.article-item {
    background: #f4f4f4;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

#searchContainer {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

#searchInput {
    width: 300px;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* le bouton de recherche s'aligne avec les autres boutons */
#searchBtn {
    background: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

#searchBtn:hover {
    background: #555;
}
```

# frontend/web/public/index.html

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gestion d'Articles</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="icon" href="data:," />
    <!-- This will suppress the favicon 404 error -->
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Gestion d'Articles</h1>
      </header>
      <nav>
        <button id="registerBtn">S'inscrire</button>
        <button id="loginBtn">Se connecter</button>
        <button id="createArticleBtn" style="display: none">
          Créer un article
        </button>
        <button id="viewArticlesBtn" style="display: none">
          Voir les articles
        </button>
        <button id="searchBtn" style="display: none">
          Rechercher un article
        </button>
        <button id="logoutBtn" style="display: none">Se déconnecter</button>
      </nav>
      <div id="searchContainer" style="display: none">
        <input
          type="text"
          id="searchInput"
          placeholder="Entrez le code article ou scannez le code-barres"
        />
      </div>
      <main id="content">
        <p class="intro-text">
          Bienvenue sur notre plateforme de gestion d'articles. Cette
          application vous permet de gérer efficacement votre inventaire
          d'articles.
        </p>
        <h2>Veuillez vous connecter ou vous inscrire.</h2>
      </main>
    </div>
    <script type="module" src="js/config.js"></script>
    <script type="module" src="js/auth.js"></script>
    <script type="module" src="js/articles.js"></script>
    <script type="module" src="js/ui.js"></script>
    <script type="module" src="js/main.js"></script>
  </body>
</html>

```

# frontend/mobile/mobile-pro/package.json

```json
{
  "name": "mobile-pro",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.6.2",
    "expo": "^51.0.0",
    "expo-image-picker": "~14.7.1",
    "expo-keep-awake": "~12.8.2",
    "expo-secure-store": "~12.8.1",
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "^0.73.9",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-web": "~0.19.10",
    "react-dom": "18.2.0",
    "@expo/metro-runtime": "~3.2.1"
  },
  "devDependencies": {
    "@babel/core": "^7.23.3"
  },
  "private": true
}

```

# frontend/mobile/mobile-pro/metro.config.js

```js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  return config;
})();
```

# frontend/mobile/mobile-pro/babel.config.js

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

# frontend/mobile/mobile-pro/app.json

```json
{
  "expo": {
    "name": "NODE-PRO Mobile",
    "slug": "node-pro-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.nodepromobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.nodepromobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you upload images for articles."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    },
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your-sentry-org",
            "project": "your-sentry-project",
            "authToken": "your-sentry-auth-token"
          }
        }
      ]
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "description": ""
  }
}
```

# frontend/mobile/mobile-pro/App.js

```js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';
import { getToken } from './services/authManager';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error);
    console.log('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true);
        connectWebSocket(token);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    disconnectWebSocket();
  };

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <AppNavigator
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          onLogout={handleLogout}
        />
      </View>
    </ErrorBoundary>
  );
}
```

# frontend/mobile/mobile-pro/.gitignore

```
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

```

# frontend/web/public/js/websocket.js

```js
import { token } from './auth.js';
import { updateArticleList, updateArticleInList, removeArticleFromList } from './articles.js';

let socket;

export function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}?token=${token}`);

  socket.onopen = () => {
    console.log('WebSocket connecté');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket déconnecté', event.code, event.reason);
    if (event.code === 1008) {
      // Token invalid, logout the user
      logout();
    }
  };

  // Setup ping-pong to keep the connection alive
  setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
    }
  }, 25000);
}

function handleWebSocketMessage(data) {
  switch (data.type) {
    case 'newArticle':
      updateArticleList(data.data);
      break;
    case 'updateArticle':
      updateArticleInList(data.data);
      break;
    case 'deleteArticle':
      removeArticleFromList(data.data.id);
      break;
    // Add other cases here for handling different types of messages
  }
}
```

# frontend/web/public/js/ui.js

```js
import { token } from './auth.js';
import { viewArticles, displayArticleDetails } from './articles.js';
import { API_BASE_URL, DEBUG_MODE } from './config.js';

export function setupUIListeners() {
    document.getElementById('searchBtn').addEventListener('click', toggleSearchBar);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        if (this.value.length > 0) {
            performSearch();
        }
    }, 300));
}

export function showLoggedInState() {
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('createArticleBtn').style.display = 'inline';
    document.getElementById('viewArticlesBtn').style.display = 'inline';
    document.getElementById('searchBtn').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'inline';
    document.getElementById('content').innerHTML = '<h2>Bienvenue! Vous êtes connecté.</h2>';
}

export function showLoggedOutState() {
    document.getElementById('registerBtn').style.display = 'inline';
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('createArticleBtn').style.display = 'none';
    document.getElementById('viewArticlesBtn').style.display = 'none';
    document.getElementById('searchBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'none';
    showWelcomePage();
}

function toggleSearchBar() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.style.display = searchContainer.style.display === 'none' ? 'flex' : 'none';
    if (searchContainer.style.display === 'flex') {
        document.getElementById('searchInput').focus();
    }
}

export async function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('Veuillez entrer un code article');
        return;
    }

    try {
        if (DEBUG_MODE) console.log(`Searching for article: ${API_BASE_URL}/articles/search/${searchTerm}`);
        const response = await fetch(`${API_BASE_URL}/articles/search/${searchTerm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Article non trouvé');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const article = await response.json();
        displayArticleDetails(article);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        alert(error.message);
    }
}

function showWelcomePage() {
    document.getElementById('content').innerHTML = `
        <p class="intro-text">
            Bienvenue sur notre plateforme de gestion d'articles. Cette
            application vous permet de gérer efficacement votre inventaire
            d'articles.
        </p>
        <h2>Veuillez vous connecter ou vous inscrire.</h2>
    `;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    }
}
```

# frontend/web/public/js/main.js

```js
import { setupAuthListeners, checkAuthState } from './auth.js';
import { setupArticleListeners, viewArticles, viewArticleDetails, editArticle, deleteArticle, displayArticleDetails } from './articles.js';
import { setupUIListeners } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    setupAuthListeners();
    setupArticleListeners();
    setupUIListeners();
    checkAuthState();
});

// Make functions globally available for inline event handlers
window.viewArticles = viewArticles;
window.viewArticleDetails = viewArticleDetails;
window.editArticle = editArticle;
window.deleteArticle = deleteArticle;
window.displayArticleDetails = displayArticleDetails;
```

# frontend/web/public/js/config.js

```js
const API_BASE_URL = 'http://localhost:3000/api';
const DEBUG_MODE = true;

export { API_BASE_URL, DEBUG_MODE };
```

# frontend/web/public/js/auth.js

```js
import { API_BASE_URL, DEBUG_MODE } from './config.js';
import { showLoggedInState, showLoggedOutState } from './ui.js';

export let token = localStorage.getItem('token');

export function setupAuthListeners() {
  document.getElementById('registerBtn').addEventListener('click', showRegisterForm);
  document.getElementById('loginBtn').addEventListener('click', showLoginForm);
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

export function checkAuthState() {
  if (token) {
    showLoggedInState();
  } else {
    showLoggedOutState();
  }
}

function showRegisterForm() {
  document.getElementById('content').innerHTML = `
    <h2>S'inscrire</h2>
    <form id="registerForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">S'inscrire</button>
    </form>
  `;
  document.getElementById('registerForm').addEventListener('submit', register);
}

function showLoginForm() {
  document.getElementById('content').innerHTML = `
    <h2>Se connecter</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">Se connecter</button>
    </form>
  `;
  document.getElementById('loginForm').addEventListener('submit', login);
}

async function register(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    if (DEBUG_MODE) console.log(`Registering with URL: ${API_BASE_URL}/auth/register`);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Inscription réussie. Veuillez vous connecter.');
      showLoginForm();
    } else {
      alert(`Erreur: ${data.message}`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur d'inscription: ${error.message}`);
  }
}

async function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    if (DEBUG_MODE) console.log(`Logging in with URL: ${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }
    const data = await response.json();
    token = data.token;
    localStorage.setItem('token', token);
    showLoggedInState();
  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur de connexion: ${error.message}`);
  }
}

function logout() {
  localStorage.removeItem('token');
  token = null;
  showLoggedOutState();
}

export { showLoginForm, showRegisterForm };
```

# frontend/web/public/js/articles.js

```js
import { API_BASE_URL, DEBUG_MODE } from './config.js';
import { token } from './auth.js';

export function setupArticleListeners() {
    document.getElementById('createArticleBtn').addEventListener('click', showCreateArticleForm);
    document.getElementById('viewArticlesBtn').addEventListener('click', () => viewArticles());
}

export async function viewArticles(viewType = 'list') {
    try {
        if (DEBUG_MODE) console.log(`Fetching articles from: ${API_BASE_URL}/articles`);
        const response = await fetch(`${API_BASE_URL}/articles`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const articles = await response.json();

        const viewButtons = `
            <div class="view-buttons">
                <button onclick="viewArticles('list')">Vue liste</button>
                <button onclick="viewArticles('grid')">Vue grille</button>
            </div>
        `;

        const articlesHTML = viewType === 'list'
            ? `<ul>${articles.map(article => `<li>${generateArticleHTML(article)}</li>`).join('')}</ul>`
            : `<div class="article-grid">${articles.map(generateArticleHTML).join('')}</div>`;

        document.getElementById('content').innerHTML = `
            <h2>Liste des articles</h2>
            ${viewButtons}
            ${articlesHTML}
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        document.getElementById('content').innerHTML = `
            <h2>Erreur</h2>
            <p>Impossible de récupérer les articles. Erreur: ${error.message}</p>
        `;
    }
}

export async function viewArticleDetails(id) {
    try {
        if (DEBUG_MODE) console.log(`Fetching article details from: ${API_BASE_URL}/articles/${id}`);
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const article = await response.json();
        displayArticleDetails(article);
    } catch (error) {
        console.error('Error fetching article details:', error);
        document.getElementById('content').innerHTML = `
            <h2>Erreur</h2>
            <p>Impossible de récupérer les détails de l'article. Erreur: ${error.message}</p>
        `;
    }
}

export async function editArticle(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const article = await response.json();
        showEditArticleForm(article);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
    }
}

export async function deleteArticle(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                alert('Article supprimé avec succès');
                viewArticles();
            } else {
                const data = await response.json();
                alert(`Erreur: ${data.message}`);
            }
        }
        catch (error) {
            console.error('Erreur:', error);
        }
    }
}

export function displayArticleDetails(article) {
    document.getElementById('content').innerHTML = `
        <h2>${article.nom}</h2>
        <p>Code: ${article.codeArticle}</p>
        <p>Description: ${article.description || 'Aucune description disponible'}</p>
        ${article.image ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 300px;">` : '<p>Aucune image disponible</p>'}
        <p>Prix: ${article.prix}€</p>
        <p>Quantité: ${article.quantite}</p>
        <button onclick="viewArticles()">Retour à la liste</button>
    `;
}

function generateArticleHTML(article) {
    return `
        <div class="article-item" data-article-id="${article._id}">
            <h3>${article.nom}</h3>
            <p>Code: ${article.codeArticle}</p>
            <p>Prix: ${article.prix}€</p>
            <p>Quantité: ${article.quantite}</p>
            ${article.image ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 200px;">` : ''}
            <button onclick="viewArticleDetails('${article._id}')">Voir détails</button>
            <button onclick="editArticle('${article._id}')">Modifier</button>
            <button onclick="deleteArticle('${article._id}')">Supprimer</button>
        </div>
    `;
}

function showCreateArticleForm() {
    document.getElementById('content').innerHTML = `
        <h2>Créer un article</h2>
        <form id="createArticleForm" enctype="multipart/form-data">
            <input type="text" id="nom" placeholder="Nom de l'article" required>
            <input type="text" id="codeArticle" placeholder="Code article" required>
            <textarea id="description" placeholder="Description"></textarea>
            <input type="file" id="image" accept="image/*">
            <input type="number" id="prix" placeholder="Prix" required>
            <input type="number" id="quantite" placeholder="Quantité" required>
            <button type="submit">Créer</button>
        </form>
    `;
    document.getElementById('createArticleForm').addEventListener('submit', createArticle);
}

function showEditArticleForm(article) {
    document.getElementById('content').innerHTML = `
        <h2>Modifier l'article</h2>
        <form id="editArticleForm" enctype="multipart/form-data">
            <input type="text" id="nom" value="${article.nom}" required>
            <input type="text" id="codeArticle" value="${article.codeArticle}" required>
            <textarea id="description">${article.description || ''}</textarea>
            <input type="file" id="image" accept="image/*">
            ${article.image ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 200px;">` : ''}
            <input type="number" id="prix" value="${article.prix}" required>
            <input type="number" id="quantite" value="${article.quantite}" required>
            <button type="submit">Mettre à jour</button>
        </form>
    `;
    document.getElementById('editArticleForm').addEventListener('submit', (e) => updateArticle(e, article._id));
}

async function createArticle(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', document.getElementById('nom').value);
    formData.append('codeArticle', document.getElementById('codeArticle').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('prix', document.getElementById('prix').value);
    formData.append('quantite', document.getElementById('quantite').value);

    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Article created:', data);
            alert('Article créé avec succès');
            viewArticles();
        } else {
            const errorData = await response.json();
            console.error('Error creating article:', errorData);
            alert(`Erreur: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateArticle(e, id) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', document.getElementById('nom').value);
    formData.append('codeArticle', document.getElementById('codeArticle').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('prix', document.getElementById('prix').value);
    formData.append('quantite', document.getElementById('quantite').value);

    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (response.ok) {
            alert('Article mis à jour avec succès');
            viewArticles();
        } else {
            const data = await response.json();
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

export { generateArticleHTML };
```

# frontend/mobile/mobile-pro/services/websocket.js

```js
import config from '../config/config';

let ws = null;
let reconnectInterval = null;

export const connectWebSocket = (token) => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(`${config.WS_URL}?token=${token}`);

  ws.onopen = () => {
    console.log('WebSocket connected');
    clearInterval(reconnectInterval);
  };

  ws.onclose = (e) => {
    console.log('WebSocket disconnected:', e.reason);
    reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect WebSocket...');
      connectWebSocket(token);
    }, 5000);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};

export const disconnectWebSocket = () => {
  if (ws) {
    clearInterval(reconnectInterval);
    ws.close();
    ws = null;
  }
};

export const getWebSocket = () => ws;
```

# frontend/mobile/mobile-pro/services/authManager.js

```js
import * as SecureStore from 'expo-secure-store';
import api, { setAuthToken } from './api';

const TOKEN_KEY = 'auth_token';

export const login = async (username, password) => {
  try {
    console.log('Sending login request to:', api.defaults.baseURL);
    const response = await api.post('/auth/login', { username, password });
    console.log('Login response:', response.data);
    const { token } = response.data;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setAuthToken(token);
    return true;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    return false;
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  setAuthToken(null);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};
```

# frontend/mobile/mobile-pro/services/api.js

```js
import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
```

# frontend/mobile/mobile-pro/screens/LoginScreen.js

```js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '../services/authManager';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }

    console.log('Attempting login with:', username);
    try {
      const success = await login(username, password);
      console.log('Login result:', success);
      if (success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
```

# frontend/mobile/mobile-pro/screens/HomeScreen.js

```js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { logout } from '../services/authManager';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NODE-PRO Mobile</Text>
      <Button
        title="View Articles"
        onPress={() => navigation.navigate('ArticleList')}
      />
      <Button
        title="Create New Article"
        onPress={() => navigation.navigate('CreateArticle')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
```

# frontend/mobile/mobile-pro/screens/EditArticleScreen.js

```js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const EditArticleScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [nom, setNom] = useState('');
  const [codeArticle, setCodeArticle] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      const articleData = response.data;
      setArticle(articleData);
      setNom(articleData.nom);
      setCodeArticle(articleData.codeArticle);
      setDescription(articleData.description);
      setPrix(articleData.prix.toString());
      setQuantite(articleData.quantite.toString());
    } catch (error) {
      console.error('Error fetching article details:', error);
      Alert.alert('Error', 'Failed to fetch article details');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('codeArticle', codeArticle);
      formData.append('description', description);
      formData.append('prix', prix);
      formData.append('quantite', quantite);
      
      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await api.put(`/articles/${articleId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Article updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating article:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to update article');
    }
  };

  if (!article) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={nom} onChangeText={setNom} />

      <Text style={styles.label}>Article Code:</Text>
      <TextInput style={styles.input} value={codeArticle} onChangeText={setCodeArticle} />

      <Text style={styles.label}>Description:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Price:</Text>
      <TextInput style={styles.input} value={prix} onChangeText={setPrix} keyboardType="numeric" />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput style={styles.input} value={quantite} onChangeText={setQuantite} keyboardType="numeric" />

      <Button title="Change image" onPress={pickImage} />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : article.image ? (
        <Image source={{ uri: `${api.defaults.baseURL}/articles/${articleId}/image` }} style={styles.image} />
      ) : null}

      <Button title="Update Article" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EditArticleScreen;
```

# frontend/mobile/mobile-pro/screens/CreateArticleScreen.js

```js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CreateArticleScreen = ({ navigation }) => {
  const [nom, setNom] = useState('');
  const [codeArticle, setCodeArticle] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('codeArticle', codeArticle);
      formData.append('description', description);
      formData.append('prix', prix);
      formData.append('quantite', quantite);
      
      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await api.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Article created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating article:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to create article');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={nom} onChangeText={setNom} />

      <Text style={styles.label}>Article Code:</Text>
      <TextInput style={styles.input} value={codeArticle} onChangeText={setCodeArticle} />

      <Text style={styles.label}>Description:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Price:</Text>
      <TextInput style={styles.input} value={prix} onChangeText={setPrix} keyboardType="numeric" />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput style={styles.input} value={quantite} onChangeText={setQuantite} keyboardType="numeric" />

      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Create Article" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CreateArticleScreen;
```

# frontend/mobile/mobile-pro/screens/ArticleListScreen.js

```js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { getWebSocket } from '../services/websocket';
import config from '../config/config';

const ArticleListScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    setupWebSocket();

    // Refresh articles when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchArticles();
    });

    return unsubscribe;
  }, [navigation]);

  const setupWebSocket = () => {
    const ws = getWebSocket();
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      Alert.alert('Error', 'Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'newArticle':
        setArticles(prevArticles => [data.data, ...prevArticles]);
        break;
      case 'updateArticle':
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article._id === data.data._id ? data.data : article
          )
        );
        break;
      case 'deleteArticle':
        setArticles(prevArticles => 
          prevArticles.filter(article => article._id !== data.data.id)
        );
        break;
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchArticles();
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/articles/search/${searchTerm}`);
      setArticles(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error searching articles:', error);
      Alert.alert('Error', 'Failed to search articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item._id })}
    >
      {item.image && (
        <Image
          source={{ uri: `${config.API_BASE_URL}/articles/${item._id}/image` }}
          style={styles.thumbnail}
        />
      )}
      <View style={styles.articleInfo}>
        <Text style={styles.articleTitle}>{item.nom}</Text>
        <Text>Code: {item.codeArticle}</Text>
        <Text>Price: {item.prix}€</Text>
        <Text>Quantity: {item.quantite}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by code or name"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No articles found</Text>
          }
          refreshing={isLoading}
          onRefresh={fetchArticles}
        />
      )}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateArticle')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ArticleListScreen;
```

# frontend/mobile/mobile-pro/screens/ArticleDetailScreen.js

```js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import api from '../services/api';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
      Alert.alert('Error', 'Failed to fetch article details');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/articles/${articleId}`);
      Alert.alert('Success', 'Article deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting article:', error);
      Alert.alert('Error', 'Failed to delete article');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleDelete() }
      ]
    );
  };

  if (!article) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{article.nom}</Text>
      {article.image && (
        <Image
          source={{ uri: `${api.defaults.baseURL}/articles/${article._id}/image` }}
          style={styles.image}
        />
      )}
      <Text>Code: {article.codeArticle}</Text>
      <Text>Description: {article.description}</Text>
      <Text>Price: {article.prix}€</Text>
      <Text>Quantity: {article.quantite}</Text>
      <Button
        title="Edit Article"
        onPress={() => navigation.navigate('EditArticle', { articleId: article._id })}
      />
      <Button
        title="Delete Article"
        onPress={confirmDelete}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default ArticleDetailScreen;
```

# frontend/mobile/mobile-pro/navigation/AppNavigator.js

```js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import EditArticleScreen from '../screens/EditArticleScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ArticleList"
          component={ArticleListScreen}
          options={{ title: 'Articles' }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={{ title: 'Article Details' }}
        />
        <Stack.Screen
          name="CreateArticle"
          component={CreateArticleScreen}
          options={{ title: 'Create Article' }}
        />
        <Stack.Screen
          name="EditArticle"
          component={EditArticleScreen}
          options={{ title: 'Edit Article' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

# frontend/mobile/mobile-pro/config/config.js

```js
import { Platform } from 'react-native';

const PROD_API_BASE_URL = 'http://your-production-api-url.com/api';
const DEV_API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
});

// If you're testing on a physical device, replace 'localhost' with your computer's local IP address
const LOCAL_MACHINE_IP = '10.21.6.10'; // Replace X with your actual IP
const PHYSICAL_DEVICE_API_BASE_URL = `http://${LOCAL_MACHINE_IP}:3000/api`;

export default {
  API_BASE_URL: __DEV__ 
    ? (Platform.OS === 'web' 
        ? DEV_API_BASE_URL 
        : PHYSICAL_DEVICE_API_BASE_URL)
    : PROD_API_BASE_URL,
  DEBUG_MODE: __DEV__,
};
```

# frontend/mobile/mobile-pro/assets/splash.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/icon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/favicon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/adaptive-icon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/settings.json

```json
{
  "urlRandomness": "m6wCDbk",
  "dev": true,
  "minify": false,
  "https": false,
  "scheme": null,
  "hostType": "lan",
  "lanType": "ip",
  "devClient": false
}

```

# frontend/mobile/mobile-pro/.expo/packager-info.json

```json
{
  "expoServerPort": 19000,
  "packagerPort": 19000
}

```

# frontend/mobile/mobile-pro/.expo/devices.json

```json
{
  "devices": []
}

```

# frontend/mobile/mobile-pro/.expo/README.md

```md
> Why do I have a folder named ".expo" in my project?
The ".expo" folder is created when an Expo project is started using "expo start" command.
> What do the files contain?
- "devices.json": contains information about devices that have recently opened this project. This is used to populate the "Development sessions" list in your development builds.
- "settings.json": contains the server configuration that is used to serve the application manifest.
> Should I commit the ".expo" folder?
No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.
Upon project creation, the ".expo" folder is already added to your ".gitignore" file.

```

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/splash-ios/splash-ios-bc25a616b4e31cf7300cd97b9cbf8894e855e6373aa797d0badd7e211111c5e5-contain/icon_undefined.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/iconsuniversal-icon/iconsuniversal-icon-74c64047eb557b1341bba7a2831eedde9ddb705e6451a9ad9f5552bf558f13de-cover-#ffffff/App-Icon-1024x1024@1x.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/splash-android/splash-android-bc25a616b4e31cf7300cd97b9cbf8894e855e6373aa797d0badd7e211111c5e5-contain/icon_undefined.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-circle/android-standard-circle-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_432.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-circle/android-standard-circle-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_324.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-circle/android-standard-circle-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_216.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-circle/android-standard-circle-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_162.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-circle/android-standard-circle-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_108.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-adaptive-foreground/android-adaptive-foreground-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-transparent/icon_432.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-adaptive-foreground/android-adaptive-foreground-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-transparent/icon_324.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-adaptive-foreground/android-adaptive-foreground-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-transparent/icon_216.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-adaptive-foreground/android-adaptive-foreground-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-transparent/icon_162.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-adaptive-foreground/android-adaptive-foreground-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-transparent/icon_108.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/favicon/favicon-24272cdaeff82cc5facdaccd982a6f05b60c4504704bbf94c19a6388659880bb-contain-transparent/favicon-48.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-square/android-standard-square-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_432.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-square/android-standard-square-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_324.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-square/android-standard-square-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_216.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-square/android-standard-square-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_162.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/.expo/web/cache/production/images/android-standard-square/android-standard-square-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-cover-#ffffff/icon_108.png

This is a binary file of the type: Image

