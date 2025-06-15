/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// 'type' is either 'data' or 'password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? '/api/v1/users/updateMe'
        : '/api/v1/users/updateMyPassword';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteAccount = async password => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v1/users/deleteMe',
      data: {
        password
      }
    });

    // if (res.data.status === 'success') {
    if (res.status == 204) {
      showAlert('success', 'Account deleted successfully!');

      window.setTimeout(() => {
        location.assign('/');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
