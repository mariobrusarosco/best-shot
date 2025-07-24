import { api } from "@/api";

type InputSetupTournament = {
	tournamentId: string;
};
export const setupTournament = async (input: InputSetupTournament) => {
	const response = await api.post(`tournaments/${input.tournamentId}/setup`);

	return response.data;
};

export const updateTournamentPerformance = async (tournamentId: string) => {
	const response = await api.patch(`tournaments/${tournamentId}/performance`);

	return response.data;
};
