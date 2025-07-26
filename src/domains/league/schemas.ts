import { z } from "zod";

/**
 * Schema for creating a new league
 */
export const createLeagueSchema = z.object({
	label: z
		.string()
		.min(1, "League name is required")
		.min(3, "League name must be at least 3 characters")
		.max(50, "League name must not exceed 50 characters")
		.regex(
			/^[a-zA-Z0-9\s\-_']+$/,
			"League name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes"
		),
	description: z
		.string()
		.max(200, "Description must not exceed 200 characters")
		.optional(),
});

/**
 * Type derived from the league creation schema
 */
export type CreateLeagueFormData = z.infer<typeof createLeagueSchema>;