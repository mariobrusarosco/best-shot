import "./styles.css";
import { useTournament, useTournaments } from "./hooks";

const Demo = () => {
	const tournaments = useTournaments();
	const selectedTournament = useTournament(tournaments.activeTournament);

	if (tournaments.isLoading) return "Loading...";

	if (tournaments.error)
		return "An error has occurred: " + tournaments.error.message;

	console.log({ selectedTournament });
	return (
		<section>
			<h1>Demo</h1>

			<h2>Tournaments</h2>
			<ul className="tournaments-list">
				{tournaments?.data?.map((tournament) => {
					return (
						<li key={tournament.id}>
							<button
								onClick={() =>
									tournaments.handleSelectTournament(tournament.id)
								}
							>
								{tournament.label}
							</button>
						</li>
					);
				})}
			</ul>

			<h2>Selected Tournament</h2>

			{selectedTournament.isSuccess ? (
				<div>
					<div className="round-actions">
						<button
							onClick={selectedTournament.handlePreviousRound}
							disabled={selectedTournament.activeRound === 1}
						>
							Prev
						</button>
						<button
							disabled={selectedTournament.activeRound === 38}
							onClick={selectedTournament.handleNextRound}
						>
							Next
						</button>
					</div>
					<ul className="rounds">
						<div className="round">
							<p className="round-id">
								Round <strong>{selectedTournament.activeRound}</strong>
							</p>
							<ul className="round-games">
								{selectedTournament.data.games.map((game) => {
									return (
										<li key={game.id} className="game">
											<div className="local-and-date">
												<strong className="stadium">{game.stadium}</strong>
												<p className="date">
													<span>{new Date(game.date).toLocaleString()}</span>
												</p>
											</div>
											<div className="teams">
												<div className="home">
													<span>{game.homeTeam}</span>
													<span>{game.homeScore}</span>
												</div>
												<span>x</span>
												<div className="away">
													<span>{game.awayScore}</span>
													<span>{game.awayTeam}</span>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</ul>
				</div>
			) : null}
		</section>
	);
};

export { Demo };
