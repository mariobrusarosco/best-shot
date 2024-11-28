import { api } from "@/api/index";
import { IMatch } from "@/domains/match/typing";
import { ITournament } from "../typing";

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
