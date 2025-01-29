import { api } from "@/api/index";
import { IMatch } from "@/domains/match/typing";
import {
	ITournament,
	ITournamentPerformance,
	ITournamentPerformanceWithDetails,
	ITournamentStandings,
} from "../typing";

export const getTournament = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { id, round }] = queryKey;

	const response = await api.get(`tournaments/${id}`, {
		params: {
			round,
		},
	});

	return response.data as ITournament;
};

export const getTournaments = async () => {
	const response = await api.get("tournaments");

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
		baseURL: "http://localhost:9090/api/v2"
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
