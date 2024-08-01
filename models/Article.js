const mongoose = require('mongoose');

// Définition du schéma pour les articles
const ArticleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  codeArticle: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Exportation du modèle Article basé sur le schéma ArticleSchema
module.exports = mongoose.model('Article', ArticleSchema);