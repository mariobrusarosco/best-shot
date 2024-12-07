import { api } from "@/api";

type InputSetupTournament = {
	tournamentId: string;
};
export const setupTournament = async (input: InputSetupTournament) => {
	const response = await api.post(`tournaments/${input.tournamentId}/setup`);

	return response.data;
};
