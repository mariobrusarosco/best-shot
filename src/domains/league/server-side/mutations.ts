import { api } from "../../../api";
import { CreateLeagueInput } from "../typing";

export const createLeague = async (createLeagueInput: CreateLeagueInput) => {
	const response = await api.post("leagues", createLeagueInput);

	return response.data;
};

export const inviteToLeague = async (invitationInput: any) => {
	const response = await api.post("leagues/invitation", invitationInput);

	return response.data;
};

export const updateLeaguePerformance = async (leagueId: string) => {
	const response = await api.patch(`leagues/${leagueId}/performance`);

	return response.data;
};

export const updateLeagueTournaments = async (
	leagueId: string,
	updateInput: { tournamentId: string; leagueId: string; status: string }[],
) => {
	const response = await api.patch(`leagues/${leagueId}/tournaments`, {
		updateInput,
	});

	return response.data;
};
