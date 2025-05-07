import { AxiosError } from "axios";
import { IErrorStructure } from "./typing";

// Function to handle Axios errors
export const handleAxiosError = (error: AxiosError): IErrorStructure => {
    if (error.response) {
      // that falls out of the range of 2xx
      return {
        source: 'AXIOS',
        message: `Server error: ${error.response.status} - ${error.response.statusText}`,
        code: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        source: 'AXIOS',
        message: "Network error: No response received from server",
        code: "NETWORK_ERROR",
        details: error.request,
      };
    } else {
      // Not an Expected Axios Error
      return {
        source: 'AXIOS',
        message: `Error: ${error.message}`,
        code: "UNKNOWN_TYPE_OF_ERROR",
        details: error, 
      };
    }
  };