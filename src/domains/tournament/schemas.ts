import { z } from "zod";

export const TournamentStatusSchema = z.enum(["active", "archived", "draft"]);
export type ITournamentStatus = z.infer<typeof TournamentStatusSchema>;

export const TournamentSchema = z
	.object({
		id: z.string().uuid(),
		label: z.string().min(3).max(50),
		logo: z.string().url(),
		memberId: z.string().uuid(),
		mode: z.string().min(3),
		status: TournamentStatusSchema.default("active"),
		onboardingCompleted: z.boolean(),
		provider: z.string().min(3),
		rounds: z.array(
			z.object({
				label: z.string().min(1).max(30),
				slug: z.string().min(1).max(30),
			})
		),
		standingsMode: z.string().min(1),
		season: z.string().min(4).max(20).optional(),
		starterRound: z.string().min(1).max(30).optional(),
		createdAt: z.string().datetime().optional(),
		updatedAt: z.string().datetime().optional(),
	})
	.describe("A tournament competition where users make predictions");

export type ITournament = z.infer<typeof TournamentSchema>;

export const TournamentStandingTeamSchema = z.object({
	id: z.string(),
	teamExternalId: z.string(),
	teamBadge: z.string(),
	tournamentId: z.string().optional(),
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
	updatedAt: z.string().optional(),
});

export const TournamentStandingGroupSchema = z.object({
	name: z.string(),
	teams: z.array(TournamentStandingTeamSchema),
});

const TournamentStandingsSchema = z.object({
	lastUpdated: z.string(),
	format: z.string(),
	teams: z.union([
		z.array(TournamentStandingTeamSchema),
		z.array(TournamentStandingGroupSchema),
	]),
});

export type ITournamentStandings = z.infer<typeof TournamentStandingsSchema>;
