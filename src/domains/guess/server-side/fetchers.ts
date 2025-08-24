import { api } from "../../../api";
import type { IGuess } from "../typing";

export const getMembers = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { memberId: string }];
	const [_key, { memberId }] = queryKeyArray;
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const getMemberGuesses = async ({ queryKey }: { queryKey: unknown }) => {
	const queryKeyArray = queryKey as [string, { tournamentId: string; round?: number }];
	const [_key, { tournamentId, round }] = queryKeyArray;

	const response = await api.get(`/tournaments/${tournamentId}/guess`, {
		params: {
			round,
		},
	});

	return response.data as IGuess[];
};
