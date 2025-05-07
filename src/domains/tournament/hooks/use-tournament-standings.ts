import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentStandings } from "../server-state/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentStandings = () => {
	const tournamentId = route.useParams().tournamentId;

	const query = useQuery({
		queryKey: tournamentStandingsKey(tournamentId),
		queryFn: getTournamentStandings,
		enabled: !!tournamentId,
	});

	return query;
};

export const tournamentStandingsKey = (id: string) => [
	"tournament",
	{ id },
	"standings",
];
