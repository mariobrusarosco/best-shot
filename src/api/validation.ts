import { z, ZodSchema } from 'zod';
import { ErrorHandling } from '@/domains/error-handling';

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly path: string,
    public readonly errors: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates API response data against a Zod schema
 * @param data The data to validate
 * @param schema The Zod schema to validate against
 * @param path The API path or identifier (for error reporting)
 * @returns The validated and typed data
 * @throws ValidationError if validation fails
 */
export function validateApiResponse<T>(
  data: unknown, 
  schema: ZodSchema<T>,
  path: string
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const validationError = new ValidationError(
      `API response validation failed for ${path}`,
      path,
      result.error.issues
    );
    
    // Log the validation error
    ErrorHandling.logError({
      source: 'API VALIDATION',
      message: validationError.message,
      code: 'VALIDATION_ERROR',
      details: result.error.format(),
    });
    
    throw validationError;
  }
  
  return result.data;
}

/**
 * Creates a type-safe API response validator
 * @param schema The Zod schema to validate against
 * @param path The API path or identifier (for error reporting)
 */
export function createApiValidator<T>(schema: ZodSchema<T>, path: string) {
  return (data: unknown): T => validateApiResponse(data, schema, path);
} 