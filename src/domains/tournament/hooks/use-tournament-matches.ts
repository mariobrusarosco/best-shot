import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentMatches } from "@/domains/tournament/server-state/fetchers";
import { useTournament } from "./use-tournament";
import { getActiveTournamentRound } from "./use-tournament-rounds";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentMatches = () => {
	const tournamentId = route.useParams().tournamentId;
	const search = route.useSearch() as { round?: string };
	const tournamentQuery = useTournament();
	const round = getActiveTournamentRound(search.round, tournamentQuery.data);

	const query = useQuery({
		queryKey: ["matches", { tournamentId, round }],
		queryFn: getTournamentMatches,
		enabled: !!tournamentId && (!!search.round || tournamentQuery.isSuccess),
	});

	return query;
};
