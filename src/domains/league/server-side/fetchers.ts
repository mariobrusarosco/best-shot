import { api } from "@/api";
import type { ILeague } from "@/domains/league/typing";

export const getLeagues = async () => {
	const response = await api.get("leagues");

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { leagueId: string }];
	const [_, { leagueId }] = queryKeyArray;

	const response = await api.get(`leagues/${leagueId}/leaderboard`);

	return response.data;
};

export const getLeague = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { leagueId: string }];
	const [_, { leagueId }] = queryKeyArray;

	const response = await api.get(`leagues/${leagueId}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as ILeague;
};
