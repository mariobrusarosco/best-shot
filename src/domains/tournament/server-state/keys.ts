export const tournamentKey = (id?: string) => ["tournament", id];
export const tournamentsKey = () => ["tournaments"];
export const tournamentMatchesKey = (tournamentId?: string, round?: string | null | undefined) => [
	"tournament",
	tournamentId,
	"matches",
	round,
];
export const tournamentScoreKey = (id?: string) => ["tournament", id, "score"];
export const tournamentStandingsKey = (id: string) => ["tournament", id, "standings"];
