import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getMemberGuesses } from "../../demo/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuess = () => {
	const tournamentId = route.useParams().tournamentId;
	const guesses = useQuery({
		queryKey: ["guess", { tournamentId }],
		queryFn: getMemberGuesses,
		enabled: !!tournamentId,
	});

	return guesses;
};
