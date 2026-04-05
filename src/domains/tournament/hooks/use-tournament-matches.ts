import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournamentMatches } from "@/domains/tournament/server-state/fetchers";
import { tournamentKey, tournamentMatchesKey } from "@/domains/tournament/server-state/keys";
import type { TournamentRoundsSearch } from "@/domains/tournament/types";
import { isKnockoutRound, overlaySimulationScores } from "@/domains/tournament/utils/simulation";
import { useTournamentSimulation } from "./use-tournament-simulation";
import { useTournamentSimulationKnockoutRounds } from "./use-tournament-simulation-knockout-rounds";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentMatches = () => {
	const search = route.useSearch() as TournamentRoundsSearch;
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;
	const simulation = useTournamentSimulation();
	const { generatedRoundsMap, isLoading: isLoadingGeneratedRounds } =
		useTournamentSimulationKnockoutRounds();

	// Derivate States
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament;
	const tournamentCurrentRound = tournament.currentRound;
	const roundSelectedOnUrl = search.round;
	const activeRound = roundSelectedOnUrl ?? tournamentCurrentRound;
	const generatedRound =
		simulation.isEnabled && activeRound ? generatedRoundsMap[activeRound] : undefined;
	const isDerivedKnockoutRound =
		simulation.isEnabled &&
		tournament?.mode === "regular-season-and-knockout" &&
		Boolean(activeRound && isKnockoutRound(activeRound));

	const query = useQuery({
		queryKey: tournamentMatchesKey(tournamentId, activeRound),
		queryFn: getTournamentMatches,
		enabled:
			!!tournamentId && !generatedRound && !isDerivedKnockoutRound && (!!search.round || !!tournament),
	});

	const tournamentMatchesData = generatedRound
		? generatedRound.matches
		: simulation.isEnabled && query.data
			? overlaySimulationScores(query.data, simulation.matchOverrides)
			: query.data;

	return {
		tournamentMatches: {
			data: tournamentMatchesData,
			states: {
				isLoading: generatedRound ? false : isDerivedKnockoutRound ? isLoadingGeneratedRounds : query.isLoading,
				isError: query.isError,
			},
			handlers: {
				refetch: query.refetch,
			},
			meta: {
				isGeneratedRound: Boolean(generatedRound),
				isSimulationEnabled: simulation.isEnabled,
			},
		},
	};
};
