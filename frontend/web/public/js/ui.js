import { token } from './auth.js';
import { viewArticles, displayArticleDetails } from './articles.js';
import { API_BASE_URL, DEBUG_MODE } from './config.js';

export function setupUIListeners() {
    document.getElementById('searchBtn').addEventListener('click', toggleSearchBar);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        if (this.value.length > 0) {
            performSearch();
        }
    }, 300));
}

export function showLoggedInState() {
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('createArticleBtn').style.display = 'inline';
    document.getElementById('viewArticlesBtn').style.display = 'inline';
    document.getElementById('searchBtn').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'inline';
    document.getElementById('content').innerHTML = '<h2>Bienvenue! Vous êtes connecté.</h2>';
}

export function showLoggedOutState() {
    document.getElementById('registerBtn').style.display = 'inline';
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('createArticleBtn').style.display = 'none';
    document.getElementById('viewArticlesBtn').style.display = 'none';
    document.getElementById('searchBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'none';
    showWelcomePage();
}

function toggleSearchBar() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.style.display = searchContainer.style.display === 'none' ? 'flex' : 'none';
    if (searchContainer.style.display === 'flex') {
        document.getElementById('searchInput').focus();
    }
}

export async function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('Veuillez entrer un code article');
        return;
    }

    try {
        if (DEBUG_MODE) console.log(`Searching for article: ${API_BASE_URL}/articles/search/${searchTerm}`);
        const response = await fetch(`${API_BASE_URL}/articles/search/${searchTerm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Article non trouvé');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const article = await response.json();
        displayArticleDetails(article);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        alert(error.message);
    }
}

function showWelcomePage() {
    document.getElementById('content').innerHTML = `
        <p class="intro-text">
            Bienvenue sur notre plateforme de gestion d'articles. Cette
            application vous permet de gérer efficacement votre inventaire
            d'articles.
        </p>
        <h2>Veuillez vous connecter ou vous inscrire.</h2>
    `;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    }
}