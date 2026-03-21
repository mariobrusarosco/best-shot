import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournamentMatches } from "@/domains/tournament/server-state/fetchers";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import type { TournamentRoundsSearch } from "@/domains/tournament/types";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentMatches = () => {
	const search = route.useSearch() as TournamentRoundsSearch;
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;

	// Derivate States
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament;
	const tournamentCurrentRound = tournament.currentRound;
	const roundSelectedOnUrl = search.round;
	const activeRound = roundSelectedOnUrl ?? tournamentCurrentRound;

	const query = useQuery({
		queryKey: ["matches", { tournamentId, activeRound }],
		queryFn: getTournamentMatches,
		enabled: !!tournamentId && (!!search.round || !!tournament),
	});

	return query;
};
