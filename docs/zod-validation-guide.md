# Zod Validation Guide for Engineers

Welcome to our project! This guide will help you understand how we use Zod for API validation and type safety.

## Quick Start

### 1. Install Dependencies

Our project already has Zod installed, so you don't need to install it separately.

### 2. Creating a New Schema

To create a new schema for an API response:

```typescript
// src/api/schema/product-schema.ts
import { z } from 'zod';

// Creating a schema
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.enum(['electronics', 'clothing', 'food']),
  inStock: z.boolean(),
});

// Creating and exporting a TS Type that represents that schema
export type Product = z.infer<typeof ProductSchema>;

// Creating and exporting another TS Type that extends that schema
// List of products
export const ProductListSchema = z.array(ProductSchema);
```

### 3. Add Your Schema to the Central Export

```typescript
// src/api/schema/index.ts
export * from './user-schema';
export * from './product-schema'; // Add your new schema here
```

### 4. Make a Validated API Request

```typescript
import { apiGet } from '@/api';
import { ProductSchema, Product } from '@/api/schema/product-schema';

async function fetchProduct(id: number): Promise<Product> {
  return apiGet(`/products/${id}`, ProductSchema);
}
```

## Working with Zod

### Common Schema Types

```typescript
// String with validation
const nameSchema = z.string().min(2).max(100);

// Number with range
const ageSchema = z.number().int().min(0).max(120);

// Boolean
const isActiveSchema = z.boolean();

// Optional fields
const descriptionSchema = z.string().optional();

// Nullable fields
const middleNameSchema = z.string().nullable();

// Arrays
const tagsSchema = z.array(z.string());

// Enums
const statusSchema = z.enum(['pending', 'active', 'completed']);

// Union types
const idSchema = z.union([z.string(), z.number()]);

// Object with nested schemas
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string().regex(/^\d{5}$/),
});
```

### Handling Optional Fields

For optional fields, you can use `.optional()`:

```typescript
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string().optional(), // This field is optional
});
```

### Schema Transformation

You can transform data during validation:

```typescript
const dateStringSchema = z.string().transform(dateStr => new Date(dateStr));

const userWithDatesSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string().transform(dateStr => new Date(dateStr)),
});
```

## Error Handling

### Catching Validation Errors

```typescript
import { ValidationError } from '@/api/validation';

try {
  const product = await fetchProduct(123);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
    console.error('Validation failed:', error.errors);
    
    // Example: Show user-friendly error message
    showErrorMessage('The server response was invalid. Please try again later.');
    
    // Example: Log detailed error information
    logError({
      type: 'API_VALIDATION_ERROR',
      endpoint: error.path,
      issues: error.errors
    });
  } else {
    // Handle other errors (network, server, etc.)
    handleGenericError(error);
  }
}
```

### Common Validation Errors

Here are common validation errors you might encounter:

1. **Missing required field**: When a required field is missing from the response
2. **Invalid type**: When a field has the wrong type (e.g., string instead of number)
3. **Failed constraint**: When a field does not meet a constraint (e.g., string too short)
4. **Invalid enum value**: When a field has a value not included in the enum

## Best Practices

1. **Keep schemas DRY**: Reuse schema components when possible
2. **Start with strict schemas**: Begin with strict validation and relax constraints if needed
3. **Validate both ways**: Validate both request and response data
4. **Document schemas**: Add comments to explain non-obvious constraints
5. **Test your schemas**: Write unit tests for complex schemas

## Examples

### Common API Patterns

#### Fetching a Resource

```typescript
// Define the schema
const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publishedAt: z.string().datetime(),
});

export type Article = z.infer<typeof ArticleSchema>;

// Use it in an API call
export function fetchArticle(id: number): Promise<Article> {
  return apiGet(`/articles/${id}`, ArticleSchema);
}
```

#### Creating a Resource

```typescript
// Define request schema (omitting server-generated fields)
const CreateArticleSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  author: z.string(),
});

// Define response schema (including server-generated fields)
const ArticleResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publishedAt: z.string().datetime(),
});

// Use it in an API call
export function createArticle(data: z.infer<typeof CreateArticleSchema>): Promise<z.infer<typeof ArticleResponseSchema>> {
  // Validate request data
  const validData = CreateArticleSchema.parse(data);
  
  // Send validated data to API
  return apiPost('/articles', validData, ArticleResponseSchema);
}
```

## Key Concepts

* Schema Creation: z.object(), z.array(), z.string(), z.number(), z.boolean(), z.enum()
Validation Functions:
parse() - Validates data and throws if invalid
safeParse() - Validates data and returns success/error object instead of throwing
Type Inference:
z.infer<typeof Schema> - Creates TypeScript types from schemas
Modifiers:
.optional() - Makes a field optional
.nullable() - Makes a field accept null
.transform() - Transforms data during validation
Schema Manipulation:
.partial() - Makes all properties optional
.omit() - Removes specific properties
.extend() - Adds properties to a schema
Constraints:
String: .email(), .url(), .min(n), .max(n), .regex()
Number: .int(), .positive(), .min(n), .max(n)
Composition:
z.union() - Allows multiple types
Nesting schemas within object properties

### Need Help?

If you have questions about using Zod in our project, please reach out to the team or check the [official Zod documentation](https://github.com/colinhacks/zod). 