import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useGuess } from "../../../../domains/guess/hooks/use-guess";
import { useTournament } from "../../../../domains/tournament/hooks/use-tournament";
import { Match } from "../../../../domains/match/components/match";
import { Guess } from "../../../../domains/guess/components/guess";

const route = getRouteApi("/_auth/tournaments/$tournamentId/matches/");

const TournamentMatches = () => {
	const tournamentId = route.useParams().tournamentId;
	const tournament = useTournament(tournamentId);
	const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	const tournamentLabel = tournament.serverState.data?.label;
	const matchesForSelectedRound = tournament.serverState.data?.matches;

	const activeGames = tournament.serverState?.data?.matches;
	const shouldRender = tournament.serverState.isSuccess && guesses.isSuccess;

	// console.log("shouldRender", shouldRender);
	// console.log("activeGames", activeGames);
	console.log("guesses", guesses.data);
	console.log("activeGames", activeGames);

	return (
		<div data-ui="tournament-page" className="screen">
			<div className="heading">
				<h2>Tournament</h2>
				<h3>{tournamentLabel}</h3>
			</div>

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
								<Match match={match} />

								<Guess
									tournamentId={tournamentId}
									match={match}
									guesses={guesses.data}
								/>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/matches/",
)({
	component: TournamentMatches,
});
