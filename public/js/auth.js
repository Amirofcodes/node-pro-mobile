import { showLoggedInState, showLoggedOutState } from './ui.js';

export let token = localStorage.getItem('token');

export function setupAuthListeners() {
  document.getElementById('registerBtn').addEventListener('click', showRegisterForm);
  document.getElementById('loginBtn').addEventListener('click', showLoginForm);
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

export function checkAuthState() {
  if (token) {
    showLoggedInState();
  } else {
    showLoggedOutState();
  }
}

function showRegisterForm() {
  document.getElementById('content').innerHTML = `
    <h2>S'inscrire</h2>
    <form id="registerForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">S'inscrire</button>
    </form>
  `;
  document.getElementById('registerForm').addEventListener('submit', register);
}

function showLoginForm() {
  document.getElementById('content').innerHTML = `
    <h2>Se connecter</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="submit">Se connecter</button>
    </form>
  `;
  document.getElementById('loginForm').addEventListener('submit', login);
}

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

function logout() {
  localStorage.removeItem('token');
  token = null;
  showLoggedOutState();
}