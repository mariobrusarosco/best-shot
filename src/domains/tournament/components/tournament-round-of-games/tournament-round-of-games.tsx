import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { useReconciledGuesses } from "@/domains/guess/hooks/use-reconciled-guesses";
import MatchCard from "@/domains/match/components/match-card/match-card";
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

	return (
		<Games data-ui="round-games" className="round-games">
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

const Games = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	maxWidth: "640px",
	gap: theme.spacing(2),
	placeContent: "start",
}));
