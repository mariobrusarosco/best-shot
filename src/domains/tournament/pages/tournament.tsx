import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/use-tournament";
import { Guess } from "../../guess/components/guess";
import { Match } from "../../match/components/match";
import { useGuess } from "../../guess/hooks/use-guess";

const TournamentPage = () => {
	const tournamentId = useParams<{ tournamentId: string }>()
		.tournamentId as string;
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

export { TournamentPage };
