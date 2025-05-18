import { z } from "zod";

export const TournamentSchema = z.object({
	id: z.string(),
	label: z.string(),
	logo: z.string(),
	memberId: z.string(),
	mode: z.string(),
	onboardingCompleted: z.boolean(),
	provider: z.string(),
	rounds: z.array(z.object({ label: z.string(), slug: z.string() })),
	standingsMode: z.string(),
	season: z.string().optional(),
	starterRound: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type ITournament = z.infer<typeof TournamentSchema>;


const TournamentPerformanceSchema = z.object({
	lastUpdated: z.string(),
	points: z.string(),
});

export type ITournamentPerformance = z.infer<typeof TournamentPerformanceSchema>;


const TournamentPerformanceWithDetailsSchema = TournamentPerformanceSchema.extend({
	details: z.record(z.number()),
	guessesByOutcome: z.object({
		correct: z.number(),
		incorrect: z.number(),
	}),
});
export type ITournamentPerformanceWithDetails = z.infer<typeof TournamentPerformanceWithDetailsSchema>;


const TournamentStandingsSchema = z.object({
	lastUpdated: z.string(),
	format: z.string(),
	teams: z.array(z.object({
		id: z.string(),
		teamExternalId: z.string(),
		tournamentId: z.string(),
		groupName: z.string().optional(),
		order: z.string(),
		shortName: z.string(),
		longName: z.string(),
		points: z.string(),
		games: z.string(),
		wins: z.string(),
		draws: z.string(),
		losses: z.string(),
		gf: z.string(),
		ga: z.string(),
		gd: z.string(),
		provider: z.string(),
	})),
});

export type ITournamentStandings = z.infer<typeof TournamentStandingsSchema>;

