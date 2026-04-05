import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useCallback, useMemo, useState } from "react";
import type { CreateGuessInput } from "@/domains/league/typing";
import type { IMatch } from "@/domains/match/typing";
import type { ITournament } from "@/domains/tournament/schemas";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import type { TournamentSearch } from "@/domains/tournament/types";
import {
	createSimulationMatchOverride,
	isSimulationSupported,
	pruneDownstreamMatchOverrides,
} from "@/domains/tournament/utils/simulation";
import { getTournamentSimulationStore, tournamentSimulationActions } from "@/stores/tournament-simulation-store";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export interface MatchSaveAdapter {
	isPending: boolean;
	lastSavedMatchId?: string | null;
	saveMatch: (match: IMatch, input: CreateGuessInput) => Promise<unknown>;
}

export const useTournamentSimulation = () => {
	const search = route.useSearch() as TournamentSearch;
	const { tournamentId } = route.useParams();
	const queryClient = useQueryClient();
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament | undefined;

	const store = useMemo(() => getTournamentSimulationStore(tournamentId), [tournamentId]);
	const simulationState = useStore(store);

	const isSupported = isSimulationSupported(tournament);
	const isEnabled = search.simulate === true && isSupported;

	const saveMatchOverride = useCallback(
		(match: IMatch, input: CreateGuessInput) => {
			if (!isEnabled || match.status !== "open") {
				return;
			}

			const nextOverrides = pruneDownstreamMatchOverrides(
				{
					...simulationState.matchOverrides,
					[match.id]: createSimulationMatchOverride(match, input),
				},
				match.round,
				tournament?.rounds ?? []
			);

			tournamentSimulationActions.replaceMatchOverrides(tournamentId, nextOverrides);
		},
		[isEnabled, simulationState.matchOverrides, tournament?.rounds, tournamentId]
	);

	const reset = useCallback(() => {
		tournamentSimulationActions.reset(tournamentId);
	}, [tournamentId]);

	return {
		isEnabled,
		isSupported,
		matchOverrides: simulationState.matchOverrides,
		actions: {
			saveMatchOverride,
			reset,
		},
	};
};

export const useTournamentSimulationSaveAdapter = (): MatchSaveAdapter => {
	const { actions } = useTournamentSimulation();
	const [lastSavedMatchId, setLastSavedMatchId] = useState<string | null>(null);

	const saveMatch = useCallback(
		(match: IMatch, input: CreateGuessInput) => {
			actions.saveMatchOverride(match, input);
			setLastSavedMatchId(match.id);
			return Promise.resolve();
		},
		[actions]
	);

	return {
		saveMatch,
		isPending: false,
		lastSavedMatchId,
	};
};
