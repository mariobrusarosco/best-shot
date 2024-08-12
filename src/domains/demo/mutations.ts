import { api } from "../../api";

export type CreateLeagueInput = {
	label: string;
	description?: string;
};

export type CreateGuessInput = {
	matchId: string;
	memberId: string;
	tournamentId: string;
	homeScore: number;
	awayScore: number;
};

export const createLeague = async (createLeagueInput: CreateLeagueInput) => {
	const response = await api.post("league", createLeagueInput);

	return response.data;
};

export const inviteToLeague = async (invitationInput: any) => {
	const response = await api.post("league/invitation", invitationInput);

	return response.data;
};

export const createGuess = async (guessInput: CreateGuessInput) => {
	const response = await api.post("guess", guessInput);

	return response.data;
};
