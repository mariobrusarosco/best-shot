import { styled } from "@mui/material";
import { Stack } from "@mui/system";
import { useMemo } from "react";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { useReconciledGuesses } from "@/domains/guess/hooks/use-reconciled-guesses";
import MatchCard from "@/domains/match/components/match-card/match-card";
import type { IMatch } from "@/domains/match/typing";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import {
	useTournamentSimulation,
	useTournamentSimulationSaveAdapter,
} from "@/domains/tournament/hooks/use-tournament-simulation";
import { buildSimulationGuess } from "@/domains/tournament/utils/simulation";

export const TournamentRoundOfGames = () => {
	const { tournamentMatches } = useTournamentMatches();
	const simulation = useTournamentSimulation();
	const shouldFetchGuesses = !(
		tournamentMatches.meta.isSimulationEnabled && tournamentMatches.meta.isGeneratedRound
	);
	const guessesQuery = useReconciledGuesses(tournamentMatches.data || [], {
		enabled: shouldFetchGuesses,
	});
	const guessMutation = useGuessMutation();
	const simulationSaveAdapter = useTournamentSimulationSaveAdapter();
	const officialSaveAdapter = useMemo(
		() => ({
			saveMatch: async (_match: IMatch, input: Parameters<typeof guessMutation.mutateAsync>[0]) =>
				guessMutation.mutateAsync(input),
			isPending: guessMutation.isPending,
			lastSavedMatchId: guessMutation.data?.matchId ?? null,
		}),
		[guessMutation]
	);

	if ((shouldFetchGuesses && guessesQuery.isError) || tournamentMatches.states.isError) {
		throw new Error("Ops! We could not find games for this round!");
	}

	if ((shouldFetchGuesses && guessesQuery.isPending) || tournamentMatches.states.isLoading) {
		return (
			<Games>
				<TournamentRoundOfGamesSkeleton />
			</Games>
		);
	}

	return (
		<Games className="round-games">
			{tournamentMatches.data?.map((match: IMatch, index: number) => {
				const isSimulationCard = simulation.isEnabled && match.status === "open";
				const guess = isSimulationCard
					? buildSimulationGuess(match, simulation.matchOverrides[match.id])
					: guessesQuery.data[index];
				const saveAdapter = isSimulationCard ? simulationSaveAdapter : officialSaveAdapter;
				const entryLabel = isSimulationCard ? "sim" : "you";

				return (
					<li key={match.id} className="round-item match-card">
						<MatchCard.Component
							key={match.id}
							match={match}
							guess={guess}
							saveAdapter={saveAdapter}
							entryLabel={entryLabel}
						/>
					</li>
				);
			})}
		</Games>
	);
};

export const TournamentRoundOfGamesSkeleton = () => {
	// Generate stable keys for skeleton items
	const skeletonKeys = Array.from({ length: 10 }, (_, i) => `skeleton-item-${i}`);

	return (
		<Stack gap={1} className="round-games-skeleton">
			{skeletonKeys.map((key) => {
				return (
					<li key={key} className="round-item match-card">
						<MatchCard.Skeleton key={`skeleton-${key}`} />
					</li>
				);
			})}
		</Stack>
	);
};

const Games = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(2),
}));
