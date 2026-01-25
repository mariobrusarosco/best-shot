import { z } from "zod";

// Tournament Metadata Schema
export const TournamentMetadataSchema = z.object({
	tournamentId: z.string().uuid(),
	tournamentName: z.string(),
	rounds: z.array(
		z.object({
			id: z.string(),
			label: z.string().min(1),
			slug: z.string(),
			startDate: z.string().datetime(),
			endDate: z.string().datetime(),
			dataSource: z.string(),
			matchCount: z.number().min(0),
			lastUpdated: z.string().datetime(),
		})
	),
	lastScrapedAt: z.string().datetime(),
	dataQuality: z.number().min(0).max(100), // 0-100 score
	activeScrapers: z.number().min(0),
	totalMatches: z.number().min(0),
	upcomingMatches: z.number().min(0),
});

// Create Tournament Schema
export const CreateTournamentSchema = z.object({
	tournamentPublicId: z.string().min(1, "Tournament public ID is required"),
	baseUrl: z.string().url("Please enter a valid base URL"),
	label: z
		.string()
		.min(3, "Tournament name must be at least 3 characters")
		.max(50, "Tournament name cannot exceed 50 characters"),
	slug: z
		.string()
		.min(1, "Tournament slug is required")
		.max(50, "Tournament slug cannot exceed 50 characters"),
	provider: z.string().min(1, "Please select a data provider"),
	season: z
		.string()
		.min(4, "Season must be at least 4 characters")
		.max(20, "Season cannot exceed 20 characters"),
	mode: z.enum(["regular-season-only", "regular-season-and-knockout", "knockout-only"]),
	standingsMode: z.enum(["unique-group", "multi-group"]),
});

// Admin Tournament Schema
export const AdminTournamentSchema = z.object({
	id: z.string().uuid(),
	label: z.string(),
	logo: z.string().url(),
	baseUrl: z.string().url(),
	provider: z.string(),
	mode: z.string(),
	standingsMode: z.string(),
	season: z.string(),
});

export const AdmingTournamentsResponseSchema = z.object({
	success: z.boolean(),
	data: AdminTournamentSchema.array(),
	message: z.string(),
});

// Admin Tournament API Response Schema
export const AdminTournamentResponseSchema = z.object({
	success: z.boolean(),
	data: AdminTournamentSchema,
	message: z.string(),
});
