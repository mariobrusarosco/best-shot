import { api } from "@/api";
import type { leagueScoreKey } from "@/domains/league/server-side/keys";
import type { ILeague } from "@/domains/league/typing";

export const getLeagues = async () => {
	const response = await api.get("leagues");

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: unknown }) => {
	const keys = queryKey as ReturnType<typeof leagueScoreKey>;
	const [_, id] = keys;

	const response = await api.get(`leagues/${id}/score`);

	return response.data;
};

export const getLeague = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { id: string }];
	const [, { id }] = queryKeyArray;

	const response = await api.get(`leagues/${id}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as ILeague;
};
