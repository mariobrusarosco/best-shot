import { z } from "zod";
import { API, api } from "@/api";
import type { IMatch } from "@/domains/match/typing";
import {
	type ITournament,
	type ITournamentStandings,
	TournamentSchema,
	TournamentScoreSchema,
} from "@/domains/tournament/schemas";
import type {
	tournamentKey,
	tournamentMatchesKey,
	tournamentScoreKey,
	tournamentStandingsKey,
} from "@/domains/tournament/server-state/keys";

// GET /api/v2/tournaments/:tournamentId/score
export const getTournamentScore = async ({ queryKey }: { queryKey: unknown }) => {
	const keys = queryKey as ReturnType<typeof tournamentScoreKey>;
	const [_, id] = keys;

	const response = await API.get(`tournaments/${id}/score`, TournamentScoreSchema, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response;
};

export const getTournament = async ({ queryKey }: { queryKey: unknown }) => {
	const keys = queryKey as ReturnType<typeof tournamentKey>;
	const [_, id, round] = keys;

	const response = await API.get(`tournaments/${id}`, TournamentSchema, {
		params: {
			round,
		},
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	// Ensure status has a default value if undefined
	return {
		...response,
		status: response.status || "active",
	};
};

export const getTournaments = async (): Promise<ITournament[]> => {
	const response = await API.get<ITournament[]>("tournaments", z.array(TournamentSchema) as any, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	console.log({ response });

	return response;
};

export const getTournamentMatches = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as ReturnType<typeof tournamentMatchesKey>;
	const [_, tournamentId, __, activeRound] = queryKeyArray;

	const response = await api.get(`tournaments/${tournamentId}/matches/${activeRound}`);

	return response.data as IMatch[];
};

export const getTournamentStandings = async ({ queryKey }: { queryKey: unknown }) => {
	const keys = queryKey as ReturnType<typeof tournamentStandingsKey>;
	const [_, id] = keys;

	const response = await api.get(`tournaments/${id}/standings`);

	return response.data as ITournamentStandings;
};
