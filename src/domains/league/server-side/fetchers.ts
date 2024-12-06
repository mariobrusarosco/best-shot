import { api } from "../../../api";

export const getLeagues = async () => {
	const response = await api.get("leagues");

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`scores/league/${leagueId}`);

	return response.data;
};
