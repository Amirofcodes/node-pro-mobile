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
    broadcast({ type: 'updateArticle', data: broadcastArticle });

    res.json(broadcastArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    broadcast({ type: 'deleteArticle', data: { id: req.params.id } });

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