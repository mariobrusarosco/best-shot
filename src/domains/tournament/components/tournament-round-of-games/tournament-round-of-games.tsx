import { styled } from "@mui/material";
import { Stack } from "@mui/system";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { useReconciledGuesses } from "@/domains/guess/hooks/use-reconciled-guesses";
import MatchCard, { MatchCardSkeleton } from "@/domains/match/components/match-card/match-card";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";

export const TournamentRoundOfGames = () => {
	const { tournamentMatches } = useTournamentMatches();
	const guessesQuery = useReconciledGuesses(tournamentMatches.data || []);
	const guessMutation = useGuessMutation();

	if (guessesQuery.isError || tournamentMatches.states.isError) {
		throw new Error("Ops! We could not find games for this round!");
	}

	if (guessesQuery.isPending || tournamentMatches.states.isLoading) {
		return (
			<Games>
				<TournamentRoundOfGamesSkeleton />
			</Games>
		);
	}

	console.log({ tournamentMatches });
	return (
		<Games className="round-games">
			{tournamentMatches.data?.map((match, index) => {
				const guess = guessesQuery.data[index];

				return (
					<li key={match.id} className="round-item match-card">
						<MatchCard.Component
							key={match.id}
							match={match}
							guess={guess}
							guessMutation={guessMutation}
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
		<Stack gap={1} className="round-games-skeleton" minWidth="438px">
			{skeletonKeys.map((key) => {
				return <MatchCardSkeleton as="li" key={`skeleton-${key}`} />;
			})}
		</Stack>
	);
};

const Games = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(2),
}));
