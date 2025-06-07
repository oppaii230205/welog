/* eslint-disable */

export const hideAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) {
    alert.parentElement.removeChild(alert);
  }
};

export const showAlert = (type, message) => {
  hideAlert(); // Ensure previous alerts are removed before showing a new one
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000); // Automatically hide the alert after 5 seconds
};
