import { AxiosError } from "axios";
import { handleAxiosError } from "../axios";


// Function to get a user-friendly error message
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const { code } = handleAxiosError(error);
    
    // Return user-friendly messages based on status codes
    switch (code) {
      case 401:
        return "You need to be logged in to perform this action.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Something went wrong on our server. Please try again later.";
      default:
        return "An error occurred. Please try again later.";
    }
  }
  
  return "An unexpected error occurred. Please try again later.";
}; 