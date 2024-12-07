import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentMatches } from "@/domains/tournament/hooks/use-tournament-matches";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentMatchesScreen = () => {
	const { activeRound } = useTournamentRounds();
	const tournament = useTournament();
	const guesses = useGuess();
	const matches = useTournamentMatches();

	console.log("matches.isFetching", matches.isFetching);
	console.log("guess.isFetching", guesses.isFetching);

	if (matches.isError || guesses.isError) {
		return (
			<MainContainer>
				<Typography variant="h3" color="red.100">
					Ops! Something went wrong
				</Typography>
			</MainContainer>
		);
	}

	if (matches.isLoading || guesses.isLoading) {
		return (
			<MainContainer>
				<Typography variant="h3" color="red.100">
					...Loading....
				</Typography>
			</MainContainer>
		);
	}

	return (
		<MainContainer data-ui="matches">
			<TournamentRoundsBar tournament={tournament} />

			<Box
				data-ui="rounds"
				sx={{
					gridColumn: {
						all: "",
						tablet: "2 / 2",
					},
				}}
			>
				<AppPill
					mt={1}
					mb={2}
					bgcolor="teal.500"
					color="neutral.100"
					width={70}
					height={20}
				>
					<Typography variant="tag">round {activeRound}</Typography>
				</AppPill>

				<Box display="grid" gap={2} className="round-games">
					{matches?.data?.map((match) => {
						const guess = guesses.data?.find((guess: IGuess) => {
							return guess.matchId === match.id;
						}) as IGuess;

						return (
							<li key={match.id} className="round-item match-card">
								<MatchCard key={match.id} match={match} guess={guess} />
							</li>
						);
					})}
				</Box>
			</Box>

			<Box
				data-ui="standings"
				sx={{
					display: {
						all: "none",
						tablet: "flex",
					},
				}}
			>
				<Typography variant="h6" color="neutral.100">
					standings
				</Typography>
			</Box>
		</MainContainer>
	);
};

const MainContainer = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		pt: [2, 10],
		pb: 14,
		px: [1.5, 3],
		gap: 2,
		width: "100%",
		display: "grid",
		gridTemplateColumns: {
			all: "1fr",
			tablet: "70px 400px 1fr",
		},
	}),
);

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatchesScreen,
});
