import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/use-tournament";

const TournamentPage = () => {
	const tournamentId = useParams<{ tournamentId: string }>()?.tournamentId;
	const { uiState, serverState } = useTournament(tournamentId);

	// Derivative State
	const tournamentLabel = serverState.data?.label;
	const matchesForSelectedRound = serverState.data?.matches;

	console.log(matchesForSelectedRound);

	return (
		<div data-ui="tournament-page" className="page">
			<div className="heading">
				<h2>Tournament</h2>
				<h3>{tournamentLabel}</h3>
			</div>

			<div className="round-actions">
				<button
					onClick={uiState.handlePreviousRound}
					disabled={uiState.activeRound === 1}
				>
					Prev
				</button>
				<p>Round {uiState.activeRound}</p>
				<button
					disabled={uiState.activeRound === 38}
					onClick={uiState.handleNextRound}
				>
					Next
				</button>
			</div>

			<ul className="round-games">
				{matchesForSelectedRound?.map((match) => {
					return (
						<li key={match.id} className="game">
							<div className="information">
								<div className="local-and-date">
									<strong className="stadium">{match.stadium}</strong>
									<p className="date">
										<span>{new Date(match.date).toLocaleString()}</span>
									</p>
								</div>
								<div className="teams">
									<div className="home">
										<span>{match.homeTeam}</span>
										<span>{match.homeScore}</span>
									</div>
									<span>x</span>
									<div className="away">
										<span>{match.awayScore}</span>
										<span>{match.awayTeam}</span>
									</div>
								</div>
							</div>

							{/* <Guess
								tournamentId={tournament?.query?.data?.id}
								game={game}
								guesses={guesses.data}
							/> */}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export { TournamentPage };
