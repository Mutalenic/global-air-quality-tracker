import { toast, ToastOptions } from 'react-toastify';

/**
 * Toast notification utilities
 * Provides consistent toast notifications across the app
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message: string, options: ToastOptions = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showErrorToast = (message: string, options: ToastOptions = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const showInfoToast = (message: string, options: ToastOptions = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const showWarningToast = (message: string, options: ToastOptions = {}) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const updateToast = (
  toastId: string | number,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success',
) => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 4000,
  });
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};
