import { getTournamentMatches } from "@/domains/tournament/server-state/fetchers";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentMatches = () => {
	const tournamentId = route.useParams().tournamentId;
	const search = route.useSearch() as { round: string };
	const round = search.round;

	const query = useQuery({
		queryKey: ["matches", { tournamentId, round }],
		queryFn: getTournamentMatches,
		enabled: !!round,
	});

	return query;
};
