const mongoose = require('mongoose');
require('dotenv').config();

// Fonction pour établir la connexion à la base de données MongoDB
const connectDB = async () => {
  try {
    // Tentative de connexion à MongoDB en utilisant l'URI stockée dans les variables d'environnement
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté');
  } catch (err) {
    // En cas d'erreur lors de la connexion, afficher l'erreur et arrêter le processus
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  }
};

// Exportation de la fonction connectDB pour être utilisée dans d'autres fichiers (notamment server.js)
module.exports = connectDB;