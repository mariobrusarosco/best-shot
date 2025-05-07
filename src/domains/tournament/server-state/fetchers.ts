import { api, API } from "@/api";
import { IMatch } from "@/domains/match/typing";
import {
	ITournamentPerformance,
	ITournamentPerformanceWithDetails,
	ITournamentStandings,
	TournamentSchema,
} from "@/domains/tournament/schemas";

export const getTournament = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { id, round }] = queryKey;

	const response = await API.get(`tournaments/${id}`, TournamentSchema, {
		params: {
			round,
		},
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response;
};

export const getTournaments = async () => {
	const response = await api.get("tournaments", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data;
};

export const getTournamentMatches = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { tournamentId, round }] = queryKey;

	const response = await api.get(
		`tournaments/${tournamentId}/matches/${round}`,
		);

	return response.data as IMatch[];
};

export const getTournamentPerformance = async ({
	queryKey,
}: {
	queryKey: any;
}) => {
	const [_key, { tournamentId }] = queryKey;

	const response = await api.get(`tournaments/${tournamentId}/performance`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as ITournamentPerformance;
};

export const getTournamentPerformanceDetails = async ({
	queryKey,
}: {
	queryKey: any;
}) => {
	const [_key, { tournamentId }] = queryKey;

	const response = await api.get(`tournaments/${tournamentId}/performance/details`);

	return response.data as ITournamentPerformanceWithDetails
};


export const getTournamentStandings = async ({
	queryKey,
}: {
	queryKey: any;
}) => {
	const [_key, { id }] = queryKey;

	const response = await api.get(`tournaments/${id}/standings`);

	return response.data as ITournamentStandings;
};
