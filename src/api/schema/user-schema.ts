import { z } from "zod";

// User schema
export const UserSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	name: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

// User list schema
export const UserListSchema = z.array(UserSchema);

// Login request schema
export const LoginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

// Login response schema
export const LoginResponseSchema = z.object({
	user: UserSchema,
	token: z.string(),
	refreshToken: z.string().optional(),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
