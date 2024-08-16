import { api } from "../../api";

export const getMembers = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { memberId }] = queryKey;
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const getMemberGuesses = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { memberId, tournamentId }] = queryKey;

	const response = await api.get("guess", {
		params: {
			memberId,
			tournamentId,
		},
	});

	return response.data;
};
