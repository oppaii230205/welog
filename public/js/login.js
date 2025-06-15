/* eslint-disable */

// Login functionality happen from the client-side
// => Use HTTP Request (or AJAX call) to send the data to the server (our API)
// => Use axios to make the HTTP request
// => Always throw an error whenever we get an error back from API endpoints

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500); // Redirect to the homepage after 1.5 seconds
    }
  } catch (err) {
    // console.log(err);
    showAlert('error', err.response.data.message); // .response.data contains the error message from the server (axios DOCs)
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === 'success') location.assign('/'); // Reload the page to reflect the logout
  } catch (err) {
    showAlert('error', 'Error logging out. Try again!');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  // console.log('Signup function called with:', {
  //   name,
  //   email,
  //   password,
  //   passwordConfirm
  // });
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
