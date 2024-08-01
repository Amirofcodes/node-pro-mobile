// Importation des modules nécessaires
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');
const articlesRoutes = require('./routes/articles');
const User = require('./models/User');
const path = require('path');

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données MongoDB
connectDB();

// Middleware pour parser le JSON et servir les fichiers statiques
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/articles', articlesRoutes);

// Route principale pour servir l'application frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route obsolète pour l'ajout de données utilisateur (à des fins de démonstration)
app.post('/api/users', async (req, res) => {
  try {
    const { name, age } = req.body;
    const timestamp = new Date();

    const user = await User.findOneAndUpdate(
      { username: 'anonymous' },
      {
        $push: {
          userData: { name, age, timestamp }
        }
      },
      { upsert: true, new: true }
    );

    console.log('Données reçues:', { name, age, timestamp });
    res.json({ message: 'Données reçues avec succès', data: { name, age, timestamp } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});