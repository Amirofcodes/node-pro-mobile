import { setupAuthListeners, checkAuthState } from './auth.js';
import { setupArticleListeners } from './articles.js';
import { setupUIListeners } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  setupAuthListeners();
  setupArticleListeners();
  setupUIListeners();
  checkAuthState();
});