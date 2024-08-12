import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useTournament } from "../domains/tournament/hooks/use-tournament";
import { useGuess } from "../domains/guess/hooks/use-guess";
import { Match } from "../domains/match/components/match";
import { Guess } from "../domains/guess/components/guess";

const route = getRouteApi("/tournaments/$id");

const TournamentPage = () => {
	console.log({ route });
	const tournamentId = route.useParams().id;
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
		<div data-ui="tournament-page" className="page">
			<div className="heading">
				<h2>Tournament</h2>
				<h3>{tournamentLabel}</h3>
			</div>

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
				{matchesForSelectedRound?.map((match) => {
					debugger;
					return (
						<li key={match.id} className="round-item">
							<Match match={match} />

							<Guess
								tournamentId={tournamentId}
								match={match}
								guesses={guesses.data}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export const Route = createLazyFileRoute("/tournaments/$id")({
	component: TournamentPage,
});
