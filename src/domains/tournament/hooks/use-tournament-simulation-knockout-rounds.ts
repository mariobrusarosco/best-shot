import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import type { ITournament } from "@/domains/tournament/schemas";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import { buildSimulatedKnockoutRounds } from "@/domains/tournament/utils/simulation";
import { useTournamentSimulation } from "./use-tournament-simulation";
import { useTournamentStandings } from "./use-tournament-standings";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentSimulationKnockoutRounds = () => {
	const { tournamentId } = route.useParams();
	const queryClient = useQueryClient();
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament | undefined;
	const standingsQuery = useTournamentStandings();
	const simulation = useTournamentSimulation();

	const generatedRounds = useMemo(() => {
		if (!simulation.isEnabled || tournament?.mode !== "regular-season-and-knockout") {
			return [];
		}

		return buildSimulatedKnockoutRounds({
			tournamentId,
			rounds: tournament.rounds ?? [],
			standings: standingsQuery.data,
			matchOverrides: simulation.matchOverrides,
		});
	}, [
		simulation.isEnabled,
		simulation.matchOverrides,
		standingsQuery.data,
		tournament?.mode,
		tournament?.rounds,
		tournamentId,
	]);

	const generatedRoundsMap = useMemo(
		() =>
			Object.fromEntries(
				generatedRounds.map((round) => [round.slug, round])
			) as Record<string, (typeof generatedRounds)[number]>,
		[generatedRounds]
	);

	return {
		generatedRounds,
		generatedRoundsMap,
		isLoading: standingsQuery.isLoading,
	};
};
