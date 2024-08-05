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