import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentMatchesScreen = () => {
	const { activeRound } = useTournamentRounds();
	const guesses = useGuess();
	const matches = useTournamentMatches();

	console.log("matches.isFetching", matches.isFetching);
	console.log("guess.isFetching", guesses.isFetching);

	if (matches.isError || guesses.isError) {
		return (
			<Typography variant="h3" color="red.100">
				Ops! Something went wrong
			</Typography>
		);
	}

	return (
		<Box
			data-ui="matches"
			className="screen"
			pt={[2, 10]}
			pb={14}
			px={[1.5, 6]}
			maxWidth="100vw"
		>
			<div className="round">
				<Pill
					mt={1}
					mb={2}
					bgcolor="teal.500"
					color="neutral.100"
					width={70}
					height={20}
				>
					<Typography variant="tag">round {activeRound}</Typography>
				</Pill>

				<Box display="grid" gap={2} className="round-games">
					{matches?.data?.map((match) => {
						const guess = guesses.data?.find((guess: IGuess) => {
							return guess.matchId === match.id;
						});

						return (
							<li key={match.id} className="round-item match-card">
								<MatchCard key={match.id} match={match} guess={guess} />
							</li>
						);
					})}
				</Box>
			</div>
		</Box>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
});
