/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const postComment = async (content, postId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/posts/${postId}/comments`,
      data: {
        content
      }
    });

    // console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Comment posted successfully!');

      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteComment = async commentId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/comments/${commentId}`
    });

    // console.log(res); // Why res.data.status is not working? res.data is null now

    // if (res.data.status === 'success') {
    if (res.status === 204) {
      // chữa cháy thôi
      showAlert('success', 'Comment deleted successfully!');

      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editComment = async (commentId, content) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/comments/${commentId}`,
      data: {
        content
      }
    });

    // Do not need to show alert
    // if (res.data.status === 'success') {
    //   showAlert('success', 'Comment updated successfully!');

    //   location.reload(true);
    // }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
