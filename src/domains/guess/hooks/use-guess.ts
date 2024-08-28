import { useQuery } from "@tanstack/react-query";
import { getMemberGuesses } from "../../demo/fetchers";
import { getUserToken } from "../../demo/utils";
import { ITournament } from "../../tournament/typing";

export const useGuess = (selectedTournament?: ITournament) => {
	const fakeAuth = getUserToken();

	const guesses = useQuery({
		queryKey: [
			"guess",
			{
				tournamentId: selectedTournament?.id,
				memberId: fakeAuth,
			},
		],
		queryFn: getMemberGuesses,
		enabled: !!selectedTournament?.id && !!fakeAuth,
	});

	return guesses;
};
