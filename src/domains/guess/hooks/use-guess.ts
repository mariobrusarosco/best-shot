import { useQuery } from "@tanstack/react-query";
import { getMemberGuesses } from "../../demo/fetchers";
import { ITournament } from "../../tournament/typing";

export const useGuess = (selectedTournament?: ITournament) => {
	const guesses = useQuery({
		queryKey: [
			"guess",
			{
				tournamentId: selectedTournament?.id,
				memberId: import.meta.env.VITE_MOCKED_MEMBER_ID,
			},
		],
		queryFn: getMemberGuesses,
		enabled: !!selectedTournament?.id,
	});

	return guesses;
};
