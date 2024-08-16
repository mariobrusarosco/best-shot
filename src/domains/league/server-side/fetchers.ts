import { api } from "../../../api";

export const getLeagues = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { memberId }] = queryKey;

	const response = await api.get("leagues", {
		params: {
			memberId,
		},
	});

	return response.data;
};

export const getLeagueScore = async ({ queryKey }: { queryKey: any }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`scores/league/${leagueId}`);

	return response.data;
};
