const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const { wss } = require('../server');

// Helper function to broadcast to all clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Route for creating an article (protected by authentication)
router.post('/', auth, async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    
    // Broadcast the new article to all connected clients
    broadcast({ type: 'newArticle', data: article });
    
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route for updating an article (protected by authentication)
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    
    // Broadcast the updated article to all connected clients
    broadcast({ type: 'updateArticle', data: article });
    
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route for deleting an article (protected by authentication)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    
    // Broadcast the deleted article ID to all connected clients
    broadcast({ type: 'deleteArticle', data: { id: req.params.id } });
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Existing routes remain unchanged
router.get('/', auth, async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;