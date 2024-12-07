import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentPerformance } from "../server-state/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentPerformance = () => {
	const tournamentId = route.useParams().tournamentId;

	const query = useQuery({
		queryKey: ["tournament-performance", { tournamentId }],
		queryFn: getTournamentPerformance,
		enabled: !!tournamentId,
	});

	return query;
};
