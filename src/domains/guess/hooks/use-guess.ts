import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getMemberGuesses } from "@/domains/demo/fetchers";
import { guessKey } from "@/domains/guess/server-side/keys";
import type { ITournament } from "@/domains/tournament/schemas";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import type { TournamentRoundsSearch } from "@/domains/tournament/types";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuess = () => {
	const search = route.useSearch() as TournamentRoundsSearch;
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;

	// Derivate States
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament;
	const tournamentCurrentRound = tournament.currentRound;
	const roundSelectedOnUrl = search.round;
	const activeRound = roundSelectedOnUrl ?? tournamentCurrentRound;

	const guesses = useQuery({
		queryKey: guessKey(tournamentId, activeRound),
		queryFn: getMemberGuesses,
		enabled: !!tournamentId && (!!search.round || !!tournament),
	});

	return guesses;
};
