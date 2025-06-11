/*eslint-disable */
// index.js is the entry point for the client side JavaScript. It usually imports other modules (delegating the actions into thes modules) and sets up event listeners for the DOM.

import '@babel/polyfill';
import { login, logout, signup } from './login';
import { postComment, deleteComment, editComment } from './comment';

// DOM ELEMENTS
const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const commentForm = document.querySelector('.form-comment');

const logoutBtn = document.getElementById('logout');

const commentsList = document.getElementById('comments-list');

// DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// ===== COMMENT HANDLING
if (commentForm) {
  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    const content = document.querySelector('.form-comment textarea').value;
    // console.log(content);
    const { postId } = commentForm.dataset; // Get the post ID from the data attribute

    postComment(content, postId);
  });
}

// Event delegation for deleting comments
if (commentsList) {
  commentsList.addEventListener('click', e => {
    const btn = e.target.closest('.btn-delete-comment');

    if (!btn) return; // If no button was clicked, exit

    e.preventDefault();
    const commentId = btn.dataset.commentId;

    // console.log(commentId);
    deleteComment(commentId);
  });
}

// Edit Comment Handling
if (commentsList) {
  commentsList.addEventListener('click', e => {
    let btn = null;

    if (e.target.closest('.btn-edit-comment')) {
      btn = e.target.closest('.btn-edit-comment');
    } else if (e.target.closest('.btn-cancel-edit')) {
      btn = e.target.closest('.btn-cancel-edit');
    }

    if (!btn) return; // If no button was clicked, exit

    e.preventDefault();
    const commentId = btn.dataset.commentId;
    const commentEl = document.querySelector(
      `.comment-content[data-comment-id="${commentId}"]`
    );
    const form = document.querySelector(
      `.form-comment-edit[data-comment-id="${commentId}"]`
    );

    // Switch to edit mode
    if (btn.classList.contains('btn-edit-comment')) {
      commentEl.classList.add('d-none');
      form.classList.remove('d-none');
      form.querySelector('textarea').value = commentEl.textContent.trim();
      form.querySelector('textarea').focus();
    }
    // Switch back to view mode
    else if (btn.classList.contains('btn-cancel-edit')) {
      commentEl.classList.remove('d-none');
      form.classList.add('d-none');
      form.querySelector('textarea').value = '';
    }
  });
}

// Submit edited comment
if (commentsList) {
  commentsList.addEventListener('submit', async e => {
    const form = e.target.closest('.form-comment-edit');

    if (!form) return;

    e.preventDefault();
    const { commentId } = form.dataset;
    const content = form.querySelector('textarea').value.trim();

    const saveBtn = form.querySelector('.btn-save-edit');
    saveBtn.disabled = true;
    saveBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Saving...';
    await editComment(commentId, content);

    // Update the UI
    const commentEl = document.querySelector(
      `.comment-content[data-comment-id="${commentId}"]`
    );
    commentEl.textContent = content;

    commentEl.classList.remove('d-none');
    form.classList.add('d-none');

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  });
}
