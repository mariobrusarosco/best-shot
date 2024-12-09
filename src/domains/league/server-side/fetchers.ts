import { api } from "@/api";
import { ILeaguePerformance, ILeagueWithParticipants } from "../typing";

export const getLeagues = async () => {
	const response = await api.get("leagues");

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`leagues/${leagueId}/leaderboard`);

	return response.data;
};

export const getLeague = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`leagues/${leagueId}`);

	return response.data as ILeagueWithParticipants;
};

export const getLeaguePerformance = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`leagues/${leagueId}/performance`);

	return response.data as ILeaguePerformance;
};
