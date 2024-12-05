import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getMemberGuesses } from "../../demo/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuess = () => {
	const tournamentId = route.useParams().tournamentId;
	const search = route.useSearch() as { round: string };
	const round = search.round;

	const guesses = useQuery({
		queryKey: ["guess", { tournamentId, round }],
		queryFn: getMemberGuesses,
		enabled: !!tournamentId && !!round,
	});

	return guesses;
};
