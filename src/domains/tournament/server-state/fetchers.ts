import { API, api } from "@/api";
import type { IMatch } from "@/domains/match/typing";
import {
	type I_TournamentPerformance,
	type I_TournamentPerformanceWithDetails,
	type I_TournamentStandings,
	TournamentSchema,
} from "@/domains/tournament/schema";

export const getTournament = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { id, round }] = queryKey;

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

export const getTournaments = async () => {
	const response = await api.get("tournaments", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data;
};

export const getTournamentMatches = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { tournamentId, round }] = queryKey;

	const response = await api.get(`tournaments/${tournamentId}/matches/${round}`);

	return response.data as IMatch[];
};

export const getTournamentPerformance = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { tournamentId }] = queryKey;

	const response = await api.get(`tournaments/${tournamentId}/performance`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as I_TournamentPerformance;
};

export const getTournamentPerformanceDetails = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { tournamentId }] = queryKey;

	const response = await api.get(`tournaments/${tournamentId}/performance/details`);

	return response.data as I_TournamentPerformanceWithDetails;
};

export const getTournamentStandings = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { id }] = queryKey;

	const response = await api.get(`tournaments/${id}/standings`);

	return response.data as I_TournamentStandings;
};
