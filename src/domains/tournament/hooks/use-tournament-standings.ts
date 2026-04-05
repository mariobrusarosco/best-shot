import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getTournamentStandings } from "@/domains/tournament/server-state/fetchers";
import { tournamentStandingsKey } from "@/domains/tournament/server-state/keys";
import { deriveSimulatedStandings } from "@/domains/tournament/utils/simulation";
import { useTournamentSimulation } from "./use-tournament-simulation";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentStandings = () => {
	const tournamentId = route.useParams().tournamentId;
	const simulation = useTournamentSimulation();

	const query = useQuery({
		queryKey: tournamentStandingsKey(tournamentId),
		queryFn: getTournamentStandings,
		enabled: !!tournamentId,
	});

	const simulatedStandings =
		simulation.isEnabled && query.data
			? deriveSimulatedStandings(query.data, simulation.matchOverrides)
			: query.data;

	return {
		...query,
		data: simulatedStandings,
	};
};
