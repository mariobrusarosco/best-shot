import { z } from "zod";
import { API, api } from "@/api";
import type { IMatch } from "@/domains/match/typing";
import {
	type ITournament,
	type ITournamentStandings,
	TournamentSchema,
} from "@/domains/tournament/schemas";

export const getTournament = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { id: string; round?: number }];
	const [_key, { id, round }] = queryKeyArray;

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
	const queryKeyArray = queryKey as [string, { tournamentId: string; round: string }];
	const [_key, { tournamentId, round }] = queryKeyArray;

	const response = await api.get(`tournaments/${tournamentId}/matches/${round}`);

	return response.data as IMatch[];
};

export const getTournamentStandings = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { id: string }];
	const [_key, { id }] = queryKeyArray;

	const response = await api.get(`tournaments/${id}/standings`);

	return response.data as ITournamentStandings;
};
