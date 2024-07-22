import { useMutation, useQuery } from "@tanstack/react-query";
import { getMemberGuesses, getMembers } from "./fetchers";
import { getUserToken } from "./utils";
import { createGuess } from "./mutations";

export const useGuessMutation = () => {
	const mutate = useMutation({
		mutationFn: createGuess,
		onSuccess: (data) => {
			alert("Guess created successfully", data);
		},
	});

	return mutate;
};

export const useGuess = (
	selectedTournament: Awaited<ReturnType<typeof useTournament>>
) => {
	const fakeAuth = getUserToken();

	const guesses = useQuery({
		queryKey: [
			"guess",
			{ tournamentId: selectedTournament?.query.data?.id, memberId: fakeAuth },
		],
		queryFn: getMemberGuesses,
		enabled: !!selectedTournament?.query.data?.id && !!fakeAuth,
	});

	return guesses;
};

export const useMembers = () => {
	const fakeAuth = getUserToken();

	const members = useQuery({
		queryKey: ["members", { memberId: fakeAuth }],
		queryFn: getMembers,
		enabled: !!fakeAuth,
	});

	return members;
};
