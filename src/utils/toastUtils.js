import { toast } from 'react-toastify';

/**
 * Toast notification utilities
 * Provides consistent toast notifications across the app
 */

const defaultOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const showWarningToast = (message, options = {}) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const showLoadingToast = (message) => {
  return toast.loading(message);
};

export const updateToast = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 4000,
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};
