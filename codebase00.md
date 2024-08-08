## Stack Technique

- **Backend** : Node.js, Express.js, MongoDB, Mongoose, WebSocket
- **Frontend Web** : HTML5, CSS3, JavaScript Vanilla, API Fetch
- **Frontend Mobile** : React Native avec Expo, React Navigation, Axios
- **Authentification** : JSON Web Tokens (JWT)
- **Téléchargement de Fichiers** : Multer, Sharp pour le traitement d'images
- **Communication en Temps Réel** : WebSocket (bibliothèque ws)
- **Gestion d'État** : État local (Web), React Hooks (Mobile)
- **Navigation** : Routage personnalisé (Web), React Navigation (Mobile)
- **UI** : Ionicons pour les icônes (Mobile)

## Points de Terminaison API

### Authentification

- POST `/api/auth/register` : Inscription d'un nouvel utilisateur
- POST `/api/auth/login` : Connexion de l'utilisateur

### Articles

- GET `/api/articles` : Récupération de tous les articles
- GET `/api/articles/:id` : Récupération d'un article spécifique
- POST `/api/articles` : Création d'un nouvel article
- PUT `/api/articles/:id` : Mise à jour d'un article existant
- DELETE `/api/articles/:id` : Suppression d'un article
- GET `/api/articles/:id/image` : Récupération de l'image d'un article
- GET `/api/articles/search/:codeArticle` : Recherche d'un article par code

## Événements WebSocket

- `newArticle` : Diffusion lors de la création d'un nouvel article
- `updateArticle` : Diffusion lors de la mise à jour d'un article
- `deleteArticle` : Diffusion lors de la suppression d'un article

````

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
        "@expo/vector-icons": "^14.0.2",
        "@react-native-community/netinfo": "^11.3.2",
        "ai-digest": "^1.0.4"
    }
}

````

# backend/server.js

```js
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const articlesRoutes = require("./routes/articles");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set("wss", wss);

const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/articles", articlesRoutes);

// Add a test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("Client disconnected");
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
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/nodepro";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

# backend/services/websocket.js

```js
const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log("Received:", message);
      // Handle incoming messages
    });

    ws.on("close", () => {
      console.log("Client disconnected");
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

# backend/routes/userData.js

```js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Route pour ajouter des données utilisateur (protégée par authentification)
router.post("/", auth, async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await User.findById(req.user.id);

    // Initialisation du tableau userData si non existant
    user.userData = user.userData || [];

    // Ajout des nouvelles données avec un horodatage
    user.userData.push({ name, age, timestamp: new Date() });
    await user.save();

    res.json({ message: "Données reçues avec succès", data: { name, age } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Route pour récupérer les données utilisateur (protégée par authentification)
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.userData || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
```

# backend/routes/auth.js

```js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Route d'inscription
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Utilisateur déjà existant" });
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
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Identifiants invalides" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Identifiants invalides" });
    }

    // Création et envoi du token JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
```

# backend/routes/articles.js

```js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const auth = require("../middleware/auth");
const { upload, resizeImage } = require("../middleware/upload");
const WebSocket = require("ws");

function broadcast(wss, data) {
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

router.post(
  "/",
  auth,
  upload.single("image"),
  resizeImage,
  async (req, res) => {
    try {
      const articleData = {
        ...req.body,
        image: req.file
          ? {
              data: req.file.buffer,
              contentType: "image/jpeg",
            }
          : undefined,
      };

      const article = new Article(articleData);
      await article.save();

      const broadcastArticle = {
        ...article.toObject(),
        image: article.image ? true : false,
      };

      // Get the WebSocket server instance
      const wss = req.app.get("wss");
      broadcast(wss, { type: "newArticle", data: broadcastArticle });

      res.status(201).json(broadcastArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const articles = await Article.find();
    const articlesWithoutImageData = articles.map((article) => ({
      ...article.toObject(),
      image: article.image ? true : false,
    }));
    res.json(articlesWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    const articleWithoutImageData = {
      ...article.toObject(),
      image: article.image ? true : false,
    };
    res.json(articleWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/:id",
  auth,
  upload.single("image"),
  resizeImage,
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = {
          data: req.file.buffer,
          contentType: "image/jpeg",
        };
      }

      const article = await Article.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!article)
        return res.status(404).json({ message: "Article not found" });

      const broadcastArticle = {
        ...article.toObject(),
        image: article.image ? true : false,
      };
      broadcast(req.app.get("wss"), {
        type: "updateArticle",
        data: broadcastArticle,
      });

      res.json(broadcastArticle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    broadcast(req.app.get("wss"), {
      type: "deleteArticle",
      data: { id: req.params.id },
    });

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/image", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || !article.image) {
      return res.status(404).send("Image not found");
    }
    res.set("Content-Type", article.image.contentType);
    res.send(article.image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search/:codeArticle", auth, async (req, res) => {
  try {
    const article = await Article.findOne({
      codeArticle: req.params.codeArticle,
    });
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    const articleWithoutImageData = {
      ...article.toObject(),
      image: article.image ? true : false,
    };
    res.json(articleWithoutImageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

# backend/models/User.js

```js
const mongoose = require("mongoose");

// Définition du schéma pour les utilisateurs
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Tableau pour stocker les données utilisateur (fonctionnalité supplémentaire)
  userData: [
    {
      name: String,
      age: Number,
      timestamp: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exportation du modèle User basé sur le schéma UserSchema
module.exports = mongoose.model("User", UserSchema);
```

# backend/models/Article.js

```js
const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  codeArticle: { type: String, required: true, unique: true },
  description: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
```

# backend/middleware/upload.js

```js
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `article-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer()
    .then((buffer) => {
      req.file.buffer = buffer;
    });

  next();
};

module.exports = { upload, resizeImage };
```

# backend/middleware/auth.js

```js
const jwt = require("jsonwebtoken");

// Middleware d'authentification
module.exports = function (req, res, next) {
  // Récupération du token depuis le header Authorization
  const token = req.header("Authorization")?.split(" ")[1];

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ msg: "Pas de token, autorisation refusée" });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajout des informations de l'utilisateur décodées à la requête
    req.user = decoded.user;
    next();
  } catch (err) {
    // En cas de token invalide, renvoyer une erreur
    res.status(401).json({ msg: "Token non valide" });
  }
};
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
    "@react-native-community/netinfo": "^11.3.2",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/stack": "^6.4.1",
    "axios": "^1.6.2",
    "expo": "^51.0.24",
    "expo-app-loading": "^1.0.3",
    "expo-image-picker": "~15.0.7",
    "expo-keep-awake": "~13.0.2",
    "expo-secure-store": "~13.0.2",
    "expo-status-bar": "~1.12.1",
    "expo-system-ui": "~3.0.7",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.74.3",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "^4.10.8",
    "react-native-screens": "^3.34.0",
    "react-native-web": "~0.19.10"
  },
  "devDependencies": {
    "@babel/core": "^7.23.3"
  },
  "private": true
}
```

# frontend/mobile/mobile-pro/metro.config.js

```js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  return config;
})();
```

# frontend/mobile/mobile-pro/index.js

```js
import { registerRootComponent } from "expo";
import App from "./src/App";

registerRootComponent(App);
```

# frontend/mobile/mobile-pro/babel.config.js

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
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
    "assetBundlePatterns": ["**/*"],
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
    "entryPoint": "./index.js"
  }
}
```

# frontend/mobile/mobile-pro/App.js

```js
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation/AppNavigator";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "./src/services/websocket";
import { getToken, isAuthenticated } from "./src/services/authManager";
import NetInfo from "@react-native-community/netinfo";
import { useDarkMode } from "./src/hooks/useDarkMode";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode, theme } = useDarkMode();

  useEffect(() => {
    checkAuthStatus();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && isAuth) {
        attemptWebSocketConnection();
      }
    });

    return () => {
      unsubscribe();
      disconnectWebSocket();
    };
  }, [isAuth]);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
      if (authStatus) {
        attemptWebSocketConnection();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setError(error.toString());
    }
  };

  const attemptWebSocketConnection = async () => {
    try {
      const token = await getToken();
      if (token) {
        connectWebSocket(token);
      }
    } catch (err) {
      console.error("Error in WebSocket connection:", err);
      setError(err.toString());
    }
  };

  if (error) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <Text style={{ color: theme.colors.text }}>An error occurred:</Text>
          <Text style={{ color: theme.colors.text }}>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

input,
textarea {
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

# frontend/web/public/js/websocket.js

```js
import { token } from "./auth.js";
import {
  updateArticleList,
  updateArticleInList,
  removeArticleFromList,
} from "./articles.js";

let socket;

export function setupWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connecté");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleWebSocketMessage(data);
  };

  socket.onclose = (event) => {
    console.log("WebSocket déconnecté", event.code, event.reason);
    if (event.code === 1008) {
      // Token invalid, logout the user
      logout();
    }
  };

  // Setup ping-pong to keep the connection alive
  setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 25000);
}

function handleWebSocketMessage(data) {
  switch (data.type) {
    case "newArticle":
      updateArticleList(data.data);
      break;
    case "updateArticle":
      updateArticleInList(data.data);
      break;
    case "deleteArticle":
      removeArticleFromList(data.data.id);
      break;
    // Add other cases here for handling different types of messages
  }
}
```

# frontend/web/public/js/ui.js

```js
import { token } from "./auth.js";
import { viewArticles, displayArticleDetails } from "./articles.js";
import { API_BASE_URL, DEBUG_MODE } from "./config.js";

export function setupUIListeners() {
  document
    .getElementById("searchBtn")
    .addEventListener("click", toggleSearchBar);
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  document.getElementById("searchInput").addEventListener(
    "input",
    debounce(function () {
      if (this.value.length > 0) {
        performSearch();
      }
    }, 300)
  );
}

export function showLoggedInState() {
  document.getElementById("registerBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("createArticleBtn").style.display = "inline";
  document.getElementById("viewArticlesBtn").style.display = "inline";
  document.getElementById("searchBtn").style.display = "inline";
  document.getElementById("logoutBtn").style.display = "inline";
  document.getElementById("content").innerHTML =
    "<h2>Bienvenue! Vous êtes connecté.</h2>";
}

export function showLoggedOutState() {
  document.getElementById("registerBtn").style.display = "inline";
  document.getElementById("loginBtn").style.display = "inline";
  document.getElementById("createArticleBtn").style.display = "none";
  document.getElementById("viewArticlesBtn").style.display = "none";
  document.getElementById("searchBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("searchContainer").style.display = "none";
  showWelcomePage();
}

function toggleSearchBar() {
  const searchContainer = document.getElementById("searchContainer");
  searchContainer.style.display =
    searchContainer.style.display === "none" ? "flex" : "none";
  if (searchContainer.style.display === "flex") {
    document.getElementById("searchInput").focus();
  }
}

export async function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (!searchTerm) {
    alert("Veuillez entrer un code article");
    return;
  }

  try {
    if (DEBUG_MODE)
      console.log(
        `Searching for article: ${API_BASE_URL}/articles/search/${searchTerm}`
      );
    const response = await fetch(
      `${API_BASE_URL}/articles/search/${searchTerm}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Article non trouvé");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const article = await response.json();
    displayArticleDetails(article);
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    alert(error.message);
  }
}

function showWelcomePage() {
  document.getElementById("content").innerHTML = `
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
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

# frontend/web/public/js/main.js

```js
import { setupAuthListeners, checkAuthState } from "./auth.js";
import {
  setupArticleListeners,
  viewArticles,
  viewArticleDetails,
  editArticle,
  deleteArticle,
  displayArticleDetails,
} from "./articles.js";
import { setupUIListeners } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
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
const API_BASE_URL = "http://localhost:3000/api";
const DEBUG_MODE = true;

export { API_BASE_URL, DEBUG_MODE };
```

# frontend/web/public/js/auth.js

```js
import { API_BASE_URL, DEBUG_MODE } from "./config.js";
import { showLoggedInState, showLoggedOutState } from "./ui.js";

export let token = localStorage.getItem("token");

export function setupAuthListeners() {
  document
    .getElementById("registerBtn")
    .addEventListener("click", showRegisterForm);
  document.getElementById("loginBtn").addEventListener("click", showLoginForm);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

export function checkAuthState() {
  if (token) {
    showLoggedInState();
  } else {
    showLoggedOutState();
  }
}

function showRegisterForm() {
  document.getElementById("content").innerHTML = `
    <h2>S'inscrire</h2>
    <form id="registerForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">S'inscrire</button>
    </form>
  `;
  document.getElementById("registerForm").addEventListener("submit", register);
}

function showLoginForm() {
  document.getElementById("content").innerHTML = `
    <h2>Se connecter</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">Se connecter</button>
    </form>
  `;
  document.getElementById("loginForm").addEventListener("submit", login);
}

async function register(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    if (DEBUG_MODE)
      console.log(`Registering with URL: ${API_BASE_URL}/auth/register`);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Inscription réussie. Veuillez vous connecter.");
      showLoginForm();
    } else {
      alert(`Erreur: ${data.message}`);
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert(`Erreur d'inscription: ${error.message}`);
  }
}

async function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    if (DEBUG_MODE)
      console.log(`Logging in with URL: ${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }
    const data = await response.json();
    token = data.token;
    localStorage.setItem("token", token);
    showLoggedInState();
  } catch (error) {
    console.error("Erreur:", error);
    alert(`Erreur de connexion: ${error.message}`);
  }
}

function logout() {
  localStorage.removeItem("token");
  token = null;
  showLoggedOutState();
}

export { showLoginForm, showRegisterForm };
```

# frontend/web/public/js/articles.js

```js
import { API_BASE_URL, DEBUG_MODE } from "./config.js";
import { token } from "./auth.js";

export function setupArticleListeners() {
  document
    .getElementById("createArticleBtn")
    .addEventListener("click", showCreateArticleForm);
  document
    .getElementById("viewArticlesBtn")
    .addEventListener("click", () => viewArticles());
}

export async function viewArticles(viewType = "list") {
  try {
    if (DEBUG_MODE)
      console.log(`Fetching articles from: ${API_BASE_URL}/articles`);
    const response = await fetch(`${API_BASE_URL}/articles`, {
      headers: { Authorization: `Bearer ${token}` },
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

    const articlesHTML =
      viewType === "list"
        ? `<ul>${articles
            .map((article) => `<li>${generateArticleHTML(article)}</li>`)
            .join("")}</ul>`
        : `<div class="article-grid">${articles
            .map(generateArticleHTML)
            .join("")}</div>`;

    document.getElementById("content").innerHTML = `
            <h2>Liste des articles</h2>
            ${viewButtons}
            ${articlesHTML}
        `;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    document.getElementById("content").innerHTML = `
            <h2>Erreur</h2>
            <p>Impossible de récupérer les articles. Erreur: ${error.message}</p>
        `;
  }
}

export async function viewArticleDetails(id) {
  try {
    if (DEBUG_MODE)
      console.log(
        `Fetching article details from: ${API_BASE_URL}/articles/${id}`
      );
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const article = await response.json();
    displayArticleDetails(article);
  } catch (error) {
    console.error("Error fetching article details:", error);
    document.getElementById("content").innerHTML = `
            <h2>Erreur</h2>
            <p>Impossible de récupérer les détails de l'article. Erreur: ${error.message}</p>
        `;
  }
}

export async function editArticle(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const article = await response.json();
    showEditArticleForm(article);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
  }
}

export async function deleteArticle(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Article supprimé avec succès");
        viewArticles();
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }
}

export function displayArticleDetails(article) {
  document.getElementById("content").innerHTML = `
        <h2>${article.nom}</h2>
        <p>Code: ${article.codeArticle}</p>
        <p>Description: ${
          article.description || "Aucune description disponible"
        }</p>
        ${
          article.image
            ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 300px;">`
            : "<p>Aucune image disponible</p>"
        }
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
            ${
              article.image
                ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 200px;">`
                : ""
            }
            <button onclick="viewArticleDetails('${
              article._id
            }')">Voir détails</button>
            <button onclick="editArticle('${article._id}')">Modifier</button>
            <button onclick="deleteArticle('${article._id}')">Supprimer</button>
        </div>
    `;
}

function showCreateArticleForm() {
  document.getElementById("content").innerHTML = `
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
  document
    .getElementById("createArticleForm")
    .addEventListener("submit", createArticle);
}

function showEditArticleForm(article) {
  document.getElementById("content").innerHTML = `
        <h2>Modifier l'article</h2>
        <form id="editArticleForm" enctype="multipart/form-data">
            <input type="text" id="nom" value="${article.nom}" required>
            <input type="text" id="codeArticle" value="${
              article.codeArticle
            }" required>
            <textarea id="description">${article.description || ""}</textarea>
            <input type="file" id="image" accept="image/*">
            ${
              article.image
                ? `<img src="${API_BASE_URL}/articles/${article._id}/image" alt="${article.nom}" style="max-width: 200px;">`
                : ""
            }
            <input type="number" id="prix" value="${article.prix}" required>
            <input type="number" id="quantite" value="${
              article.quantite
            }" required>
            <button type="submit">Mettre à jour</button>
        </form>
    `;
  document
    .getElementById("editArticleForm")
    .addEventListener("submit", (e) => updateArticle(e, article._id));
}

async function createArticle(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("nom", document.getElementById("nom").value);
  formData.append("codeArticle", document.getElementById("codeArticle").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("prix", document.getElementById("prix").value);
  formData.append("quantite", document.getElementById("quantite").value);

  const imageFile = document.getElementById("image").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Article created:", data);
      alert("Article créé avec succès");
      viewArticles();
    } else {
      const errorData = await response.json();
      console.error("Error creating article:", errorData);
      alert(`Erreur: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function updateArticle(e, id) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("nom", document.getElementById("nom").value);
  formData.append("codeArticle", document.getElementById("codeArticle").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("prix", document.getElementById("prix").value);
  formData.append("quantite", document.getElementById("quantite").value);

  const imageFile = document.getElementById("image").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      alert("Article mis à jour avec succès");
      viewArticles();
    } else {
      const data = await response.json();
      alert(`Erreur: ${data.message}`);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}

export { generateArticleHTML };
```

# frontend/mobile/mobile-pro/assets/splash.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/icon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/favicon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/assets/adaptive-icon.png

This is a binary file of the type: Image

# frontend/mobile/mobile-pro/src/styles/theme.js

```js
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

const commonStyles = {
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  textVariants: {
    header: {
      fontFamily: "System",
      fontSize: 36,
      fontWeight: "bold",
    },
    body: {
      fontFamily: "System",
      fontSize: 16,
    },
  },
};

export const lightTheme = {
  ...DefaultTheme,
  ...commonStyles,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007AFF",
    background: "#F2F2F7",
    card: "#FFFFFF",
    text: "#000000",
    border: "#C7C7CC",
    notification: "#FF3B30",
    surface: "#FFFFFF",
    white: "#FFFFFF",
  },
};

export const darkTheme = {
  ...DarkTheme,
  ...commonStyles,
  colors: {
    ...DarkTheme.colors,
    primary: "#0A84FF",
    background: "#000000",
    card: "#1C1C1E",
    text: "#FFFFFF",
    border: "#38383A",
    notification: "#FF453A",
    surface: "#1C1C1E",
    white: "#FFFFFF",
  },
};
```

# frontend/mobile/mobile-pro/src/services/websocket.js

```js
import config from "../config/config";

let ws = null;
let reconnectInterval = null;
let token = null;
let isConnecting = false;

const MAX_RECONNECT_DELAY = 5000;
let reconnectDelay = 1000;

export const connectWebSocket = (authToken) => {
  if (isConnecting) return;
  isConnecting = true;

  token = authToken;
  if (!token) {
    console.log("No token available, skipping WebSocket connection");
    isConnecting = false;
    return;
  }

  if (ws) {
    ws.close();
  }

  const wsUrl = `${config.WS_URL}?token=${token}`;
  console.log("Connecting to WebSocket:", wsUrl);
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connected");
    isConnecting = false;
    clearInterval(reconnectInterval);
    reconnectDelay = 1000; // Reset the delay on successful connection
  };

  ws.onclose = (e) => {
    console.log("WebSocket disconnected:", e.code, e.reason);
    isConnecting = false;
    scheduleReconnection();
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    isConnecting = false;
  };

  return ws;
};

const scheduleReconnection = () => {
  if (!reconnectInterval) {
    reconnectInterval = setInterval(() => {
      console.log("Attempting to reconnect WebSocket...");
      connectWebSocket(token);
    }, 5000);
  }
};

export const disconnectWebSocket = () => {
  if (ws) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
    ws.close();
    ws = null;
  }
  token = null;
};

export const getWebSocket = () => ws;

export const isConnected = () => ws && ws.readyState === WebSocket.OPEN;
```

# frontend/mobile/mobile-pro/src/services/authManager.js

```js
import * as SecureStore from "expo-secure-store";
import api, { setAuthToken } from "./api";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

const storeToken = async (token) => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
};

const removeToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    const { token } = response.data;
    await storeToken(token);
    setAuthToken(token);
    return true;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post("/auth/register", { username, password });
    console.log("Register response:", response.status, response.data);
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const logout = async () => {
  await removeToken();
  setAuthToken(null);
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

export { getToken };
```

# frontend/mobile/mobile-pro/src/services/api.js

```js
import axios from "axios";
import config from "../config/config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
```

# frontend/mobile/mobile-pro/src/hooks/useDarkMode.js

```js
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../styles/theme";

export const useDarkMode = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? darkTheme : lightTheme;

  return { isDarkMode, theme };
};
```

# frontend/mobile/mobile-pro/src/config/config.js

```js
import { Platform } from "react-native";

const PROD_API_BASE_URL = "http://your-production-api-url.com/api";
const DEV_API_BASE_URL = Platform.select({
  ios: "http://localhost:3000/api",
  android: "http://10.0.2.2:3000/api",
});

// If you're testing on a physical device, replace 'localhost' with your computer's local IP address
const LOCAL_MACHINE_IP = "192.168.1.16"; // Replace with your actual IP
const PHYSICAL_DEVICE_API_BASE_URL = `http://${LOCAL_MACHINE_IP}:3000/api`;

const config = {
  API_BASE_URL: __DEV__
    ? Platform.OS === "web"
      ? DEV_API_BASE_URL
      : PHYSICAL_DEVICE_API_BASE_URL
    : PROD_API_BASE_URL,
  WS_URL: __DEV__
    ? Platform.OS === "web"
      ? "ws://localhost:3000"
      : `ws://${LOCAL_MACHINE_IP}:3000`
    : "wss://your-production-ws-url.com",
  DEBUG_MODE: __DEV__,
};

export default config;
```

# frontend/mobile/mobile-pro/src/navigation/AppNavigator.js

```js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ArticleListScreen from "../screens/ArticleListScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import CreateArticleScreen from "../screens/CreateArticleScreen";
import EditArticleScreen from "../screens/EditArticleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ArticleStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{ title: "Articles" }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: "Article Details" }}
      />
      <Stack.Screen
        name="CreateArticle"
        component={CreateArticleScreen}
        options={{ title: "Create Article" }}
      />
      <Stack.Screen
        name="EditArticle"
        component={EditArticleScreen}
        options={{ title: "Edit Article" }}
      />
    </Stack.Navigator>
  );
};

const MainTab = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Articles") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Articles"
        component={ArticleStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Main" component={MainTab} />
  </Stack.Navigator>
);

export default RootNavigator;
```

# frontend/mobile/mobile-pro/src/screens/SearchScreen.js

```js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter an article code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/articles/search/${searchQuery}`);
      navigation.navigate("ArticleDetail", { articleId: response.data._id });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Not Found", "No article found with the given code");
      } else {
        console.error("Error searching article:", error);
        Alert.alert(
          "Error",
          "An error occurred while searching. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Search Articles
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Enter article code"
          placeholderTextColor={theme.colors.text + "80"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="search" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.helperText, { color: theme.colors.text }]}>
        Enter the article code to search for a specific article.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  helperText: {
    fontSize: 14,
  },
});

export default SearchScreen;
```

# frontend/mobile/mobile-pro/src/screens/RegisterScreen.js

```js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { register } from "../services/authManager";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await register(username, password);
      if (success) {
        Alert.alert(
          "Success",
          "Registration successful. Please log in with your new credentials.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        setError(
          "Registration failed. Please try again with a different username."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 40,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: "center",
      marginBottom: 15,
    },
    loginLink: {
      marginTop: 20,
      alignItems: "center",
    },
    loginText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={theme.colors.text}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Username"
          placeholderTextColor={theme.colors.text + "80"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color={theme.colors.text}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor={theme.colors.text + "80"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color={theme.colors.text}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.text + "80"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
```

# frontend/mobile/mobile-pro/src/screens/ProfileScreen.js

```js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../services/authManager";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert(
        "Logout Error",
        "An error occurred while logging out. Please try again."
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={[styles.username, { color: theme.colors.text }]}>
          User Profile
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Account Information
        </Text>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Username: John Doe
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Email: john.doe@example.com
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          App Information
        </Text>
        <View style={styles.infoItem}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={theme.colors.text}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Version: 1.0.0
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
```

# frontend/mobile/mobile-pro/src/screens/LoginScreen.js

```js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { login } from "../services/authManager";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(username, password);
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    logo: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 40,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: "center",
      marginBottom: 15,
    },
    registerLink: {
      marginTop: 20,
      alignItems: "center",
    },
    registerText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.logo}>NODE-PRO Mobile</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={theme.colors.text}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Username"
          placeholderTextColor={theme.colors.text + "80"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color={theme.colors.text}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor={theme.colors.text + "80"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
```

# frontend/mobile/mobile-pro/src/screens/HomeScreen.js

```js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const menuItems = [
    {
      title: "View Articles",
      icon: "list",
      screen: "Articles",
      color: "#4CAF50",
    },
    {
      title: "Create New Article",
      icon: "add-circle",
      screen: "CreateArticle",
      color: "#2196F3",
    },
    {
      title: "My Profile",
      icon: "person",
      screen: "Profile",
      color: "#9C27B0",
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.menuItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={32} color="#fff" />
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          NODE-PRO Mobile
        </Text>
        <Text style={[styles.subHeaderText, { color: theme.colors.text }]}>
          Manage your articles with ease
        </Text>
      </View>
      <View style={styles.menuGrid}>{menuItems.map(renderMenuItem)}</View>
      <Text style={[styles.footerText, { color: theme.colors.text }]}>
        © 2024 NODE-PRO Mobile
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 16,
    marginTop: 5,
  },
  menuGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  menuItemText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    textAlign: "center",
    marginBottom: 20,
  },
});

export default HomeScreen;
```

# frontend/mobile/mobile-pro/src/screens/EditArticleScreen.js

```js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../services/api";

const EditArticleScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [nom, setNom] = useState("");
  const [codeArticle, setCodeArticle] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
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
      console.error("Error fetching article details:", error);
      Alert.alert("Error", "Failed to fetch article details");
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
      formData.append("nom", nom);
      formData.append("codeArticle", codeArticle);
      formData.append("description", description);
      formData.append("prix", prix);
      formData.append("quantite", quantite);

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("image", {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await api.put(`/articles/${articleId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Article updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error(
        "Error updating article:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Failed to update article");
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
      <TextInput
        style={styles.input}
        value={codeArticle}
        onChangeText={setCodeArticle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={prix}
        onChangeText={setPrix}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        value={quantite}
        onChangeText={setQuantite}
        keyboardType="numeric"
      />

      <Button title="Change image" onPress={pickImage} />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : article.image ? (
        <Image
          source={{
            uri: `${api.defaults.baseURL}/articles/${articleId}/image`,
          }}
          style={styles.image}
        />
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
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EditArticleScreen;
```

# frontend/mobile/mobile-pro/src/screens/CreateArticleScreen.js

```js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

const CreateArticleScreen = () => {
  const [nom, setNom] = useState("");
  const [codeArticle, setCodeArticle] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();

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
    if (
      !nom.trim() ||
      !codeArticle.trim() ||
      !prix.trim() ||
      !quantite.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("codeArticle", codeArticle);
      formData.append("description", description);
      formData.append("prix", prix);
      formData.append("quantite", quantite);

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("image", {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Article created successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating article:", error);
      Alert.alert("Error", "Failed to create article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create New Article
        </Text>

        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Name"
          placeholderTextColor={theme.colors.text + "80"}
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Article Code"
          placeholderTextColor={theme.colors.text + "80"}
          value={codeArticle}
          onChangeText={setCodeArticle}
        />
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Description"
          placeholderTextColor={theme.colors.text + "80"}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Price"
          placeholderTextColor={theme.colors.text + "80"}
          value={prix}
          onChangeText={setPrix}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Quantity"
          placeholderTextColor={theme.colors.text + "80"}
          value={quantite}
          onChangeText={setQuantite}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons
            name="image-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            style={[styles.imageButtonText, { color: theme.colors.primary }]}
          >
            Pick an image
          </Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Article</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 15,
    borderRadius: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateArticleScreen;
```

# frontend/mobile/mobile-pro/src/screens/ArticleListScreen.js

```js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

const ArticleListScreen = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/articles");
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.nom.toLowerCase().includes(query.toLowerCase()) ||
          article.codeArticle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() =>
        navigation.navigate("ArticleDetail", { articleId: item._id })
      }
    >
      {item.image ? (
        <Image
          source={{ uri: `${api.defaults.baseURL}/articles/${item._id}/image` }}
          style={styles.articleImage}
        />
      ) : (
        <View style={[styles.articleImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={24} color={theme.colors.text} />
        </View>
      )}
      <View style={styles.articleInfo}>
        <Text style={[styles.articleTitle, { color: theme.colors.text }]}>
          {item.nom}
        </Text>
        <Text style={[styles.articleCode, { color: theme.colors.text }]}>
          Code: {item.codeArticle}
        </Text>
        <Text style={[styles.articlePrice, { color: theme.colors.primary }]}>
          Price: {item.prix}€
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { color: theme.colors.text, borderColor: theme.colors.border },
          ]}
          placeholder="Search by name or code..."
          placeholderTextColor={theme.colors.text + "80"}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("CreateArticle")}
      >
        <Text style={styles.createButtonText}>Create New Article</Text>
      </TouchableOpacity>
      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {searchQuery ? "No articles found" : "No articles available"}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  articleItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  articleInfo: {
    flex: 1,
    justifyContent: "center",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  articleCode: {
    fontSize: 14,
    marginBottom: 4,
  },
  articlePrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    margin: 16,
  },
  emptyText: {
    textAlign: "center",
    margin: 16,
    fontSize: 16,
  },
});

export default ArticleListScreen;
```

# frontend/mobile/mobile-pro/src/screens/ArticleDetailScreen.js

```js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import api from "../services/api";

const ArticleDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error("Error fetching article details:", error);
      setError("Failed to fetch article details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/articles/${articleId}`);
      Alert.alert("Success", "Article deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting article:", error);
      Alert.alert("Error", "Failed to delete article");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDelete(), style: "destructive" },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.m,
    },
    image: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
      borderRadius: 8,
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    infoContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.s,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: "bold",
    },
    deleteButton: {
      backgroundColor: theme.colors.notification,
    },
    errorText: {
      color: theme.colors.notification,
      textAlign: "center",
      marginTop: theme.spacing.m,
    },
  });

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchArticleDetails}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!article) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {article.image && (
          <Image
            source={{
              uri: `${api.defaults.baseURL}/articles/${article._id}/image`,
            }}
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{article.nom}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Code:</Text>
            <Text style={styles.infoValue}>{article.codeArticle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price:</Text>
            <Text style={styles.infoValue}>{article.prix}€</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity:</Text>
            <Text style={styles.infoValue}>{article.quantite}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          {article.description || "No description available."}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("EditArticle", { articleId: article._id })
          }
        >
          <Text style={styles.buttonText}>Edit Article</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>Delete Article</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ArticleDetailScreen;
```
