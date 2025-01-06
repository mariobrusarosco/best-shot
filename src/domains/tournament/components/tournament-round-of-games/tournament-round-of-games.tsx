import { useGuess } from "@/domains/guess/hooks/use-guess";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { IGuess } from "@/domains/guess/typing";
import MatchCard from "@/domains/match/components/match-card/match-card";
import { styled } from "@mui/material";
import { Stack } from "@mui/system";
import { useTournamentMatches } from "../../hooks/use-tournament-matches";

const TournamentRoundOfGames = () => {
	const guessesQuery = useGuess();
	const matchesQuery = useTournamentMatches();
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

	return (
		<Games className="round-games">
			{matchesQuery.data?.map((match) => {
				const guess = guessesQuery.data?.find((guess: IGuess) => {
					return guess.matchId === match.id;
				}) as IGuess;

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

const TournamentRoundOfGamesSkeleton = () => {
	return (
		<Stack gap={1} className="round-games-skeleton">
			{Array.from({ length: 10 }).map((_, index) => {
				return (
					<li key={index} className="round-item match-card">
						<MatchCard.Skeleton key={index} />
					</li>
				);
			})}
		</Stack>
	);
};

const Games = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(2),
}));

export default {
	Component: TournamentRoundOfGames,
	Skeleton: TournamentRoundOfGamesSkeleton,
};
