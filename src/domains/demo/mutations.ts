import { api } from "../../api";

export type CreatLeagueInput = {
	label: string;
	description?: string;
};

export const createLeague = async (createLeagueInput: CreatLeagueInput) => {
	const response = await api.post("league", createLeagueInput);

	return response.data;
};

export const inviteToLeague = async (invitationInput: any) => {
	const response = await api.post("league/invitation", invitationInput);

	return response.data;
};

export const createGuess = async (guessInput: {
	matchId: number;
	tournamentId: number;
	homeScore: number;
	awayScore: number;
	memberId: string;
}) => {
	const response = await api.post("guess", guessInput);

	return response.data;
};
