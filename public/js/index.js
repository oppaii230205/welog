/*eslint-disable */
// index.js is the entry point for the client side JavaScript. It usually imports other modules (delegating the actions into thes modules) and sets up event listeners for the DOM.

import '@babel/polyfill';
import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logoutBtn = document.getElementById('logout');

// DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
