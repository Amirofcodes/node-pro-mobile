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