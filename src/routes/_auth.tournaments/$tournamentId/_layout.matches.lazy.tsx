import { useGuess } from "@/domains/guess/hooks/use-guess";
import { TournamentRoundsBar } from "@/domains/tournament/components/tournament-rounds-bar";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Box } from "@mui/system";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const TournamentMatches = () => {
	const tournamentId = route.useParams().tournamentId;
	const tournament = useTournament(tournamentId);
	const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	// const tournamentLabel = tournament.serverState.data?.label;
	const matchesForSelectedRound = tournament.serverState.data?.matches;

	const activeGames = tournament.serverState?.data?.matches;
	const shouldRender = tournament.serverState.isSuccess && guesses.isSuccess;

	// console.log("shouldRender", shouldRender);
	// console.log("activeGames", activeGames);
	console.log("guesses", guesses.data);
	console.log("activeGames", activeGames);

	return (
		<Box
			data-ui="matches"
			className="screen"
			py={[6, 10]}
			px={[2, 6]}
			maxWidth="100vw"
		>
			<TournamentRoundsBar />

			{shouldRender ? (
				<div className="round">
					<div className="round-actions">
						<button
							onClick={tournament.uiState.handlePreviousRound}
							disabled={tournament.uiState.activeRound === 1}
						>
							Prev
						</button>
						<p>Round {tournament.uiState.activeRound}</p>
						<button
							disabled={tournament.uiState.activeRound === 38}
							onClick={tournament.uiState.handleNextRound}
						>
							Next
						</button>
					</div>

					<ul className="round-games">
						{matchesForSelectedRound?.map((match) => (
							<li key={match.id} className="round-item match-card">
								{/* <Match match={match} /> */}

								{/* <Guess
									tournamentId={tournamentId}
									match={match}
									guesses={guesses.data}
								/> */}
							</li>
						))}
					</ul>
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
