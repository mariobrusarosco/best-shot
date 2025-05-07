# API Type Safety and Validation with Zod

This document outlines our approach to validating API responses and ensuring type safety using [Zod](https://github.com/colinhacks/zod).

## Core Principles

1. **Schema-Based Validation**: All API responses should be validated against a Zod schema.
2. **Type Safety**: Leverage TypeScript's type inference from Zod schemas to ensure type safety.
3. **Centralized Schema Definitions**: Schemas should be defined in a centralized location and reused across the application.
4. **Consistent Error Handling**: Validation errors should be handled consistently and provide clear information.

## Implementation

### Directory Structure

```
src/api/
  ├── index.ts          # Main API client with Zod integration
  ├── validation.ts     # Validation utilities
  ├── examples.ts       # Example usage
  └── schema/           # Schema definitions
      ├── index.ts      # Central export of all schemas
      ├── user-schema.ts # User-related schemas
      └── ...           # Other domain-specific schemas
```

### Defining Schemas

Schemas should be defined in domain-specific files within the `src/api/schema/` directory:

```typescript
// src/api/schema/user-schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  // ...
});

export type User = z.infer<typeof UserSchema>;
```

### Making API Requests

Use the type-safe API request functions that integrate Zod validation:

```typescript
import { apiGet } from '@/api';
import { UserSchema } from '@/api/schema/user-schema';

// This function will validate the response against UserSchema
const user = await apiGet('/users/123', UserSchema);
```

### Error Handling

Validation errors are handled through the `ValidationError` class, which extends the built-in `Error` class:

```typescript
try {
  const user = await apiGet('/users/123', UserSchema);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
    console.error('Validation failed:', error.errors);
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. **Define Schemas First**: Before implementing API requests, define the schemas for request and response data.
2. **Reuse Schema Components**: Break down complex schemas into reusable components.
3. **Add Explicit Validations**: Don't rely solely on TypeScript types; use Zod's validation capabilities.
4. **Validate Request Data**: Validate data before sending it to ensure it meets API requirements.
5. **Handle Validation Errors Gracefully**: Provide user-friendly error messages for validation failures.

## Advanced Uses

### Partial Updates

Use Zod's `partial()` method for partial updates:

```typescript
const UserUpdateSchema = UserSchema.partial();
```

### Schema Transformation

Use Zod's transform capabilities to convert API responses to application models:

```typescript
const ApiUserSchema = z.object({
  user_id: z.number(),
  user_name: z.string(),
  // ...
});

const UserSchema = ApiUserSchema.transform(data => ({
  id: data.user_id,
  name: data.user_name,
  // ...
}));
```

### Request/Response Schema Pairs

Define related request and response schemas together:

```typescript
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});
``` 