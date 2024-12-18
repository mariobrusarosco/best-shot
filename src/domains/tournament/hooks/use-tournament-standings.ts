import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentStandings } from "../server-state/fetchers";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentStandings = () => {
	const id = route.useParams().tournamentId;

	const query = useQuery({
		queryKey: ["tournament", { id }, "standings"],
		queryFn: getTournamentStandings,
		enabled: !!id,
	});

	return query;
};
