import { api } from "@/api";
import type { ILeague, ILeaguePerformance } from "../typing";

export const getLeagues = async () => {
	const response = await api.get("leagues");

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`leagues/${leagueId}/leaderboard`);

	return response.data;
};

export const getLeague = async () => {
	const response = await api.get("league", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as ILeague;
};

export const getLeaguePerformance = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`leagues/${leagueId}/performance`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as ILeaguePerformance;
};
