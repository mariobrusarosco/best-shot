import { styled } from "@mui/material";
import { Stack } from "@mui/system";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { useReconciledGuesses } from "@/domains/guess/hooks/use-reconciled-guesses";
import MatchCard from "@/domains/match/components/match-card/match-card";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";

export const TournamentRoundOfGames = () => {
	const matchesQuery = useTournamentMatches();
	const guessesQuery = useReconciledGuesses(matchesQuery.data || []);
	const guessMutation = useGuessMutation();

	if (guessesQuery.isError || matchesQuery.isError) {
		throw new Error("Ops! We could not find games for this round!");
	}

	if (guessesQuery.isPending || matchesQuery.isPending) {
		return (
			<Games>
				<TournamentRoundOfGamesSkeleton />
			</Games>
		);
	}

	console.log({ matches: matchesQuery });

	return (
		<Games className="round-games">
			{matchesQuery.data?.map((match, index) => {
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

const Games = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(2),
}));
