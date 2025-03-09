import { AxiosError } from "axios";
import { handleAxiosError } from "./axios";
import { logError } from "./logger";

export const handleQueryError = (error: unknown): void => {
    if (error instanceof AxiosError) {
      const errorDetails = handleAxiosError(error);
      logError(errorDetails);
    } else if (error instanceof Error) {
      logError({
        source: 'QUERY_CACHE',
        message: `Error: ${error.message}`,
        details: error,
      });
    } else {
      logError({
        source: 'QUERY_CACHE',
        message: "Unknown error occurred",
        details: error,
      });
    }
  };