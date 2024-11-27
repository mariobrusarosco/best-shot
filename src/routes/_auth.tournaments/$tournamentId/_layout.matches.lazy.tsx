import { useGuess } from "@/domains/guess/hooks/use-guess";
import { IGuess } from "@/domains/guess/typing";
import { MatchCard } from "@/domains/match/components/match-card/match-card";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentRounds } from "@/domains/tournament/hooks/use-tournament-rounds";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentMatches = () => {
	const tournament = useTournament();
	const { activeRound } = useTournamentRounds();
	const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	const matchesForSelectedRound = tournament.serverState.data?.matches;
	const shouldRender = tournament.serverState.isSuccess && guesses.isSuccess;

	if (tournament.serverState.isLoading || guesses.isLoading) {
		return (
			<Typography variant="h3" color="neutral.100">
				Loading...
			</Typography>
		);
	}

	return (
		<Box
			data-ui="matches"
			className="screen"
			py={[6, 10]}
			px={[2, 6]}
			maxWidth="100vw"
		>
			<TournamentRoundsBar tournament={tournament} />
			{shouldRender ? (
				<div className="round">
					<Pill
						mt={6}
						mb={2}
						bgcolor="teal.500"
						color="neutral.100"
						width={70}
						height={20}
					>
						<Typography variant="tag">round {activeRound}</Typography>
					</Pill>

					<Box display="grid" gap={2} pb={7} className="round-games">
						{matchesForSelectedRound?.map((match) => {
							// console.log("[Match --- match], match", match);
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
			) : null}
		</Box>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/matches",
)({
	component: TournamentMatches,
});
