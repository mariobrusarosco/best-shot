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
