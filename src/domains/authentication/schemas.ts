import { z } from "zod";

/**
 * Schema for Auth0 ID token claims
 * Represents the structure of user data returned from Auth0 getIdTokenClaims()
 */
export const auth0TokenSchema = z.object({
	sub: z.string().min(1, "User ID (sub) is required"),
	email: z.string().email("Valid email is required"),
	nickname: z.string().optional(),
	given_name: z.string().optional(),
	family_name: z.string().optional(),
	name: z.string().optional(),
	// Additional Auth0 fields that may be present
	picture: z.string().url().optional(),
	email_verified: z.boolean().optional(),
	updated_at: z.string().optional(),
	iss: z.string().optional(),
	aud: z.string().optional(),
	iat: z.number().optional(),
	exp: z.number().optional(),
});

/**
 * Type for Auth0 token claims
 */
export type Auth0Token = z.infer<typeof auth0TokenSchema>;

/**
 * Helper function to extract nickname from Auth0 token with fallbacks
 */
const extractNickName = (token: Auth0Token): string => {
	return (
		token.nickname?.trim() ||
		token.given_name?.trim() ||
		token.name?.split(" ")[0]?.trim() ||
		token.email.split("@")[0]
	);
};

/**
 * Schema for creating a member from Auth0 token
 * Transforms Auth0 token data into the format required by the API
 */
export const createMemberFromAuth0Schema = auth0TokenSchema.transform((token) => {
	const nickName = extractNickName(token);

	return {
		publicId: token.sub,
		email: token.email,
		nickName,
		firstName: token.given_name?.trim() || undefined,
		lastName: token.family_name?.trim() || undefined,
	} as {
		publicId: string;
		email: string;
		nickName: string;
		firstName?: string;
		lastName?: string;
	};
});

/**
 * Type for member creation request (mapped from Auth0 token)
 */
export type CreateMemberFromAuth0 = z.infer<typeof createMemberFromAuth0Schema>;

