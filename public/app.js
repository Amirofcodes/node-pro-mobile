// Variables globales
let token = localStorage.getItem('token');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const createArticleBtn = document.getElementById('createArticleBtn');
const viewArticlesBtn = document.getElementById('viewArticlesBtn');
const searchBtn = document.getElementById('searchBtn');
const logoutBtn = document.getElementById('logoutBtn');
const content = document.getElementById('content');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', () => {
    // Ajout des écouteurs d'événements
    registerBtn.addEventListener('click', showRegisterForm);
    loginBtn.addEventListener('click', showLoginForm);
    createArticleBtn.addEventListener('click', showCreateArticleForm);
    viewArticlesBtn.addEventListener('click', () => viewArticles());
    searchBtn.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if within a form
            performSearch();
        }
        searchInput.addEventListener('input', debounce(function() {
            if (this.value.length > 0) {
                performSearch();
            }
        }, 300)); // 300ms debounce
    });
    logoutBtn.addEventListener('click', logout);

    // Vérification de l'état de connexion au chargement de la page
    if (token) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }
});

// Fonction pour afficher la page d'accueil
function showWelcomePage() {
    content.innerHTML = `
        <p class="intro-text">
            Bienvenue sur notre plateforme de gestion d'articles. Cette
            application vous permet de gérer efficacement votre inventaire
            d'articles.
        </p>
        <h2>Veuillez vous connecter ou vous inscrire.</h2>
    `;
}

// Fonction pour afficher le formulaire d'inscription
function showRegisterForm() {
    content.innerHTML = `
        <h2>S'inscrire</h2>
        <form id="registerForm">
            <input type="text" id="username" placeholder="Nom d'utilisateur" required>
            <input type="password" id="password" placeholder="Mot de passe" required>
            <button type="submit">S'inscrire</button>
        </form>
    `;
    document.getElementById('registerForm').addEventListener('submit', register);
}

// Fonction pour afficher le formulaire de connexion
function showLoginForm() {
    content.innerHTML = `
        <h2>Se connecter</h2>
        <form id="loginForm">
            <input type="text" id="username" placeholder="Nom d'utilisateur" required>
            <input type="password" id="password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
    `;
    document.getElementById('loginForm').addEventListener('submit', login);
}

// Fonction pour afficher le formulaire de création d'article
function showCreateArticleForm() {
    content.innerHTML = `
        <h2>Créer un article</h2>
        <form id="createArticleForm">
            <input type="text" id="nom" placeholder="Nom de l'article" required>
            <input type="text" id="codeArticle" placeholder="Code article" required>
            <textarea id="description" placeholder="Description"></textarea>
            <input type="text" id="image" placeholder="URL de l'image">
            <input type="number" id="prix" placeholder="Prix" required>
            <input type="number" id="quantite" placeholder="Quantité" required>
            <button type="submit">Créer</button>
        </form>
    `;
    document.getElementById('createArticleForm').addEventListener('submit', createArticle);
}

// Fonction pour gérer l'inscription
async function register(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Inscription réussie. Veuillez vous connecter.');
            showLoginForm();
        } else {
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour gérer la connexion
async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showLoggedInState();
        } else {
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour créer un article
async function createArticle(e) {
    e.preventDefault();
    const articleData = {
        nom: document.getElementById('nom').value,
        codeArticle: document.getElementById('codeArticle').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value,
        prix: document.getElementById('prix').value,
        quantite: document.getElementById('quantite').value
    };
    try {
        const response = await fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(articleData)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Article créé avec succès');
            viewArticles();
        } else {
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour afficher la liste des articles
async function viewArticles(viewType = 'list') {
    try {
        const response = await fetch('/api/articles', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const articles = await response.json();
        
        // Boutons pour changer de vue
        const viewButtons = `
            <div class="view-buttons">
                <button onclick="viewArticles('list')">Vue liste</button>
                <button onclick="viewArticles('grid')">Vue grille</button>
            </div>
        `;

        // Fonction pour générer le HTML d'un article
        const generateArticleHTML = (article) => `
            <div class="article-item">
                <h3>${article.nom}</h3>
                <p>Code: ${article.codeArticle}</p>
                <p>Prix: ${article.prix}€</p>
                <p>Quantité: ${article.quantite}</p>
                <button onclick="viewArticleDetails('${article._id}')">Voir détails</button>
            </div>
        `;

        // Génération du HTML en fonction du type de vue
        const articlesHTML = viewType === 'list'
            ? `<ul>${articles.map(article => `<li>${generateArticleHTML(article)}</li>`).join('')}</ul>`
            : `<div class="article-grid">${articles.map(generateArticleHTML).join('')}</div>`;

        content.innerHTML = `
            <h2>Liste des articles</h2>
            ${viewButtons}
            ${articlesHTML}
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
    }
}

// Fonction pour afficher les détails d'un article
async function viewArticleDetails(id) {
    try {
        const response = await fetch(`/api/articles/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const article = await response.json();
        displayArticleDetails(article);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'article:', error);
        content.innerHTML = '<p>Erreur lors du chargement des détails de l\'article.</p>';
    }
}

// Fonction pour afficher l'état connecté
function showLoggedInState() {
    registerBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    createArticleBtn.style.display = 'inline';
    viewArticlesBtn.style.display = 'inline';
    searchBtn.style.display = 'inline';
    logoutBtn.style.display = 'inline';
    content.innerHTML = '<h2>Bienvenue! Vous êtes connecté.</h2>';
}

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('token');
    token = null;
    showLoggedOutState();
}

// Fonction pour afficher l'état déconnecté
function showLoggedOutState() {
    registerBtn.style.display = 'inline';
    loginBtn.style.display = 'inline';
    createArticleBtn.style.display = 'none';
    viewArticlesBtn.style.display = 'none';
    searchBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    searchContainer.style.display = 'none';
    showWelcomePage();
}

// Fonction pour afficher/masquer la barre de recherche
function toggleSearchBar() {
    searchContainer.style.display = searchContainer.style.display === 'none' ? 'flex' : 'none';
    if (searchContainer.style.display === 'flex') {
        searchInput.focus();
    }
}

// Fonction pour effectuer la recherche
async function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        alert('Veuillez entrer un code article');
        return;
    }

    try {
        const response = await fetch(`/api/articles/search/${searchTerm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Article non trouvé');
        }

        const article = await response.json();
        displayArticleDetails(article);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        alert(error.message);
    }
}

// Fonction pour afficher les détails de l'article
function displayArticleDetails(article) {
    content.innerHTML = `
        <h2>${article.nom}</h2>
        <p>Code: ${article.codeArticle}</p>
        <p>Description: ${article.description || 'Aucune description disponible'}</p>
        ${article.image ? `<img src="${article.image}" alt="${article.nom}" style="max-width: 300px;">` : '<p>Aucune image disponible</p>'}
        <p>Prix: ${article.prix}€</p>
        <p>Quantité: ${article.quantite}</p>
        <button onclick="viewArticles()">Retour à la liste</button>
    `;
}

//debounce function 
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    }
}

// Afficher la page d'accueil au chargement initial
showWelcomePage();