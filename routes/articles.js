const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// Route pour créer un article (protégée par authentification)
router.post('/', auth, async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour récupérer tous les articles (protégée par authentification)
router.get('/', auth, async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer un article spécifique par son ID (protégée par authentification)
router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour rechercher un article par son code
router.get('/search/:codeArticle', auth, async (req, res) => {
  try {
      const article = await Article.findOne({ codeArticle: req.params.codeArticle });
      if (!article) {
          return res.status(404).json({ message: 'Article non trouvé' });
      }
      res.json(article);
  } catch (error) {
      console.error('Erreur lors de la recherche de l\'article:', error);
      res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;