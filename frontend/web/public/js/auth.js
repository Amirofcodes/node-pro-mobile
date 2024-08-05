import { API_BASE_URL, DEBUG_MODE } from './config.js';
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
    if (DEBUG_MODE) console.log(`Registering with URL: ${API_BASE_URL}/auth/register`);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    alert(`Erreur d'inscription: ${error.message}`);
  }
}

async function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    if (DEBUG_MODE) console.log(`Logging in with URL: ${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }
    const data = await response.json();
    token = data.token;
    localStorage.setItem('token', token);
    showLoggedInState();
  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur de connexion: ${error.message}`);
  }
}

function logout() {
  localStorage.removeItem('token');
  token = null;
  showLoggedOutState();
}

export { showLoginForm, showRegisterForm };