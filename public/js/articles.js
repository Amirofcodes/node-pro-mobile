import { token } from './auth.js';

export function setupArticleListeners() {
  document.getElementById('createArticleBtn').addEventListener('click', showCreateArticleForm);
  document.getElementById('viewArticlesBtn').addEventListener('click', () => viewArticles());
  // Make functions globally accessible
  window.viewArticles = viewArticles;
  window.viewArticleDetails = viewArticleDetails;
  window.editArticle = editArticle;
  window.deleteArticle = deleteArticle;
}

function showCreateArticleForm() {
  document.getElementById('content').innerHTML = `
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

export async function viewArticles(viewType = 'list') {
    try {
      const response = await fetch('/api/articles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const articles = await response.json();
  
      const viewButtons = `
        <div class="view-buttons">
          <button onclick="viewArticles('list')">Vue liste</button>
          <button onclick="viewArticles('grid')">Vue grille</button>
        </div>
      `;
  
      const articlesHTML = viewType === 'list'
        ? `<ul>${articles.map(article => `<li>${generateArticleHTML(article)}</li>`).join('')}</ul>`
        : `<div class="article-grid">${articles.map(generateArticleHTML).join('')}</div>`;
  
      document.getElementById('content').innerHTML = `
        <h2>Liste des articles</h2>
        ${viewButtons}
        ${articlesHTML}
      `;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      document.getElementById('content').innerHTML = `
        <h2>Erreur</h2>
        <p>Impossible de récupérer les articles. Erreur: ${error.message}</p>
      `;
    }
  }

export function generateArticleHTML(article) {
  return `
    <div class="article-item" data-article-id="${article._id}">
      <h3>${article.nom}</h3>
      <p>Code: ${article.codeArticle}</p>
      <p>Prix: ${article.prix}€</p>
      <p>Quantité: ${article.quantite}</p>
      <button onclick="viewArticleDetails('${article._id}')">Voir détails</button>
      <button onclick="editArticle('${article._id}')">Modifier</button>
      <button onclick="deleteArticle('${article._id}')">Supprimer</button>
    </div>
  `;
}

export async function viewArticleDetails(id) {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const article = await response.json();
    displayArticleDetails(article);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'article:', error);
    document.getElementById('content').innerHTML = '<p>Erreur lors du chargement des détails de l\'article.</p>';
  }
}

export async function editArticle(id) {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const article = await response.json();
    showEditArticleForm(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
  }
}

function showEditArticleForm(article) {
  document.getElementById('content').innerHTML = `
    <h2>Modifier l'article</h2>
    <form id="editArticleForm">
      <input type="text" id="nom" value="${article.nom}" required>
      <input type="text" id="codeArticle" value="${article.codeArticle}" required>
      <textarea id="description">${article.description || ''}</textarea>
      <input type="text" id="image" value="${article.image || ''}">
      <input type="number" id="prix" value="${article.prix}" required>
      <input type="number" id="quantite" value="${article.quantite}" required>
      <button type="submit">Mettre à jour</button>
    </form>
  `;
  document.getElementById('editArticleForm').addEventListener('submit', (e) => updateArticle(e, article._id));
}

export async function updateArticle(e, id) {
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
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(articleData)
    });
    if (response.ok) {
      alert('Article mis à jour avec succès');
      viewArticles();
    } else {
      const data = await response.json();
      alert(`Erreur: ${data.message}`);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

export async function deleteArticle(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert('Article supprimé avec succès');
        viewArticles();
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.message}`);
      }
    }
    catch (error) {
      console.error('Erreur:', error);
    }
  }
}

export function updateArticleList(newArticle) {
  const articleList = document.querySelector('.article-grid, ul');
  if (articleList) {
    const articleItem = generateArticleHTML(newArticle);
    if (articleList.tagName === 'UL') {
      const li = document.createElement('li');
      li.innerHTML = articleItem;
      articleList.appendChild(li);
    } else {
      const div = document.createElement('div');
      div.className = 'article-item';
      div.innerHTML = articleItem;
      articleList.appendChild(div);
    }
  }
}

export function updateArticleInList(updatedArticle) {
  const articleItem = document.querySelector(`[data-article-id="${updatedArticle._id}"]`);
  if (articleItem) {
    articleItem.innerHTML = generateArticleHTML(updatedArticle);
  }
}

export function removeArticleFromList(articleId) {
  const articleItem = document.querySelector(`[data-article-id="${articleId}"]`);
  if (articleItem) {
    articleItem.remove();
  }
}

export function displayArticleDetails(article) {
  document.getElementById('content').innerHTML = `
    <h2>${article.nom}</h2>
    <p>Code: ${article.codeArticle}</p>
    <p>Description: ${article.description || 'Aucune description disponible'}</p>
    ${article.image ? `<img src="${article.image}" alt="${article.nom}" style="max-width: 300px;">` : '<p>Aucune image disponible</p>'}
    <p>Prix: ${article.prix}€</p>
    <p>Quantité: ${article.quantite}</p>
    <button onclick="viewArticles()">Retour à la liste</button>
  `;
}