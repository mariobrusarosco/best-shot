import { api } from "../../../api";
import { IGuess } from "../typing";

export const getMembers = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { memberId }] = queryKey;
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const getMemberGuesses = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { tournamentId, round }] = queryKey;

	const response = await api.get(`/tournaments/${tournamentId}/guess`, {
		params: {
			round,
		},
	});

	return response.data as IGuess[];
};
