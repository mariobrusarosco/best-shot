import { z } from "zod";

export const MatchResponseSchema = z.object({
	id: z.string(),
	date: z.string(),
	round: z.string(),
	status: z.string(),
	home: z.object({
		id: z.string(),
		score: z.number().nullish(),
		shortName: z.string(),
		badge: z.string(),
		name: z.string(),
		penaltiesScore: z.string().nullish(),
	}),
	away: z.object({
		id: z.string(),
		score: z.number().nullish(),
		shortName: z.string(),
		badge: z.string(),
		name: z.string(),
		penaltiesScore: z.string().nullish(),
	}),
	timebox: z.string().nullish(),
});
