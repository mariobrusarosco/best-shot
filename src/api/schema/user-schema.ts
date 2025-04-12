import { z } from 'zod';

// Base user schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']).optional(),
  createdAt: z.string().datetime(),
});

// Type inference from the schema
export type User = z.infer<typeof UserSchema>;

// List of users
export const UserListSchema = z.array(UserSchema);

// Login request schema
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Login response schema
export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

// User creation schema (without id and createdAt which are server-generated)
export const UserCreateSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true 
});

// User update schema (all fields optional)
export const UserUpdateSchema = UserCreateSchema.partial(); 