import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getMemberGuesses } from "@/domains/demo/fetchers";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { getActiveTournamentRound } from "@/domains/tournament/hooks/use-tournament-rounds";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useGuess = () => {
	const tournamentId = route.useParams().tournamentId;
	const search = route.useSearch() as { round?: string };
	const tournamentQuery = useTournament();
	const round = getActiveTournamentRound(search.round, tournamentQuery.data);

	const guesses = useQuery({
		queryKey: guessKey(tournamentId, round),
		queryFn: getMemberGuesses,
		enabled: !!tournamentId && (!!search.round || tournamentQuery.isSuccess),
	});

	return guesses;
};

export const guessKey = (tournamentId: string, round: string | undefined = undefined) => [
	"guess",
	{ tournamentId, round },
];
