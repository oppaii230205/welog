/*eslint-disable */
// index.js is the entry point for the client side JavaScript. It usually imports other modules (delegating the actions into thes modules) and sets up event listeners for the DOM.

import '@babel/polyfill';
import { login, logout, signup } from './login';
import { postComment, deleteComment, editComment } from './comment';
import { updateSettings, deleteAccount } from './updateSettings';
import { createPost } from './post';

// DOM ELEMENTS
const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');

const commentForm = document.querySelector('.form-comment');

const userProfileForm = document.querySelector('.form-profile');
const userPasswordForm = document.querySelector('.form-password');
const deleteAccountForm = document.querySelector('.form-delete-account');
const avatarUploadForm = document.querySelector('.form-avatar-upload');

const createPostForm = document.querySelector('.form-create-post');

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

// ===== COMMENT HANDLING =====
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

// ===== USER PROFILE HANDLING =====
if (userProfileForm) {
  userProfileForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('passwordNew').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const saveBtn = userPasswordForm.querySelector('.btn--save-password');
    saveBtn.disabled = true;
    saveBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Saving...';

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Password';
    document.getElementById('passwordCurrent').value = '';
    document.getElementById('passwordNew').value = '';
    document.getElementById('passwordConfirm').value = '';
  });
}

if (deleteAccountForm) {
  deleteAccountForm.addEventListener('submit', async e => {
    e.preventDefault();

    const password = document.getElementById('deletePassword').value;

    const deleteBtn = deleteAccountForm.querySelector('.btn--delete-account');
    deleteBtn.disabled = true;
    deleteBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    await deleteAccount(password);

    deleteBtn.disabled = false;
    deleteBtn.textContent = 'Delete Account';
  });
}

if (avatarUploadForm) {
  avatarUploadForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Mannually create a FormData object (so do not need to specify enctype="multipart/form-data" in the form)
    const formData = new FormData();
    formData.append('photo', document.getElementById('photo').files[0]);

    const saveBtn = avatarUploadForm.querySelector('.btn--save-photo');
    saveBtn.disabled = true;
    saveBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Uploading...';

    await updateSettings(formData, 'data');

    saveBtn.disabled = false;
    saveBtn.textContent = 'Upload';
  });
}

// ===== CREATE POST HANDLING =====
if (createPostForm) {
  createPostForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);

    const tags = document
      .getElementById('tags')
      .value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== ''); // Remove empty tags

    // console.log(tags);
    // console.log(JSON.stringify(tags));
    // formData.append('tags', tags);
    tags.forEach(tag => formData.append('tags[]', tag)); // Right way to append array to FormData
    // console.log(formData.getAll('tags[]')); // Debugging line to check tags

    if (document.getElementById('coverImage').files[0]) {
      formData.append(
        'coverImage',
        document.getElementById('coverImage').files[0]
      );
    }

    const saveBtn = createPostForm.querySelector('.btn--create-post');
    saveBtn.disabled = true;
    saveBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Creating...';

    await createPost(formData);

    saveBtn.dispabled = false;
    saveBtn.textContent = 'Create Post';
  });
}
