import { api } from "../../api";
import { ITournament } from "../tournament/typing";

export const getTournament = async ({ queryKey }) => {
	const [_key, { id, activeRound }] = queryKey;

	const response = await api.get(`tournament/${id}?round=${activeRound}`);

	return response.data as ITournament;
};

export const getTournaments = async () => {
	const response = await api.get("tournament");

	return response.data;
};

export const getMembers = async ({ queryKey }) => {
	const [_key, { memberId }] = queryKey;
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const getLeagues = async ({ queryKey }) => {
	const [_key, { memberId }] = queryKey;

	const response = await api.get("league", {
		params: {
			memberId,
		},
	});

	return response.data;
};

export const getMemberGuesses = async ({ queryKey }) => {
	const [_key, { memberId, tournamentId }] = queryKey;

	const response = await api.get("guess", {
		params: {
			memberId,
			tournamentId,
		},
	});

	return response.data;
};

export const getLeagueScore = async ({ queryKey }) => {
	const [_, { leagueId }] = queryKey;

	const response = await api.get(`score/league/${leagueId}`);

	return response.data;
};
