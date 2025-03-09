import { getUserFriendlyErrorMessage } from '../utils/error-handler';

/**
 * Hook for displaying error notifications to users.
 * This is a placeholder implementation. You should replace it with your
 * actual notification system (e.g., react-toastify, notistack, etc.).
 */
export const useErrorNotification = () => {
  /**
   * Display an error notification to the user.
   * @param error The error object
   * @param customMessage Optional custom message to display instead of the default one
   */
  const showErrorNotification = (error: unknown, customMessage?: string) => {
    const message = customMessage || getUserFriendlyErrorMessage(error);
    
    // This is a placeholder. Replace with your actual notification system.
    console.log('[ERROR NOTIFICATION]', message);
    
    // Example with react-toastify (uncomment if you're using it)
    // toast.error(message);
    
    // Example with notistack (uncomment if you're using it)
    // enqueueSnackbar(message, { variant: 'error' });
  };

  return {
    showErrorNotification,
  };
}; 