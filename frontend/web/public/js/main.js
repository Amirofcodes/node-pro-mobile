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