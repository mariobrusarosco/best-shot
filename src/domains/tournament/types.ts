import type { z } from "zod";
import type {
	TournamentSchema,
	TournamentScoreSchema,
	TournamentStandingGroupSchema,
	TournamentStandingsSchema,
	TournamentStandingTeamSchema,
} from "@/domains/tournament/schemas";

export type TournamentRoundsSearch = {
	selectedRound?: string;
};

export type ITournament = z.infer<typeof TournamentSchema>;

export type ITournamentStandingTeam = z.infer<typeof TournamentStandingTeamSchema>;
export type ITournamentStandingGroup = z.infer<typeof TournamentStandingGroupSchema>;
export type ITournamentStandings = z.infer<typeof TournamentStandingsSchema>;
export type ITournamentScore = z.infer<typeof TournamentScoreSchema>;
