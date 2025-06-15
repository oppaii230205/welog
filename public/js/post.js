/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const createPost = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/posts`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Post created successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
