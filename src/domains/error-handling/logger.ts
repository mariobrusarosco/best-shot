import { IErrorStructure } from "./typing";
import { isEmpty } from 'lodash-es';


export const logError = (errorDetails: IErrorStructure): void | null => {
  if (isEmpty(errorDetails)) return null

  const { source, message, code, details } = errorDetails;

  console.error(`${source}: ${message}`, {
    code,
    details,
  });
    
    // Here we could also send the error to a monitoring service like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(new Error(errorDetails.message), {
    //     extra: {
    //       code: errorDetails.code,
    //       details: errorDetails.details,
    //     },
    //   });
    // }
  };