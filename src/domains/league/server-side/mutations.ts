import { api } from "@/api";
import type { CreateLeagueInput } from "@/domains/league/typing";

export const createLeague = async (createLeagueInput: CreateLeagueInput) => {
	const response = await api.post("leagues", createLeagueInput);

	return response.data;
};

export const inviteToLeague = async (invitationInput: { leagueId: string; guestId: string }) => {
	const response = await api.post("leagues/invitation", invitationInput);

	return response.data;
};

export const updateLeagueTournaments = async (
	leagueId: string,
	updateInput: { tournamentId: string; leagueId: string; status: string }[]
) => {
	const response = await api.patch(`leagues/${leagueId}/tournaments`, {
		updateInput,
	});

	return response.data;
};
