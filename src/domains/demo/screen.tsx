import "./styles.css";
import { useGuess, useMembers } from "./hooks";

import { Guess } from "./components/guess";
import { Outlet } from "react-router-dom";
import { useTournament } from "../tournament/hooks/use-tournament";
import { useTournaments } from "../tournament/hooks/use-tournaments";

const Demo = () => {
	const member = useMembers();
	const tournaments = useTournaments();
	const tournament = useTournament(tournaments.activeTournamentId);
	const guesses = useGuess(tournament);

	if (tournaments.isLoading) return "Loading...";

	if (tournaments.error)
		return "An error has occurred: " + tournaments.error.message;

	const activeGames = tournament?.query.data?.round.games;
	const shouldRender = tournament.query.isSuccess && guesses.isSuccess;

	console.log("shouldRender", shouldRender);
	console.log("activeGames", activeGames);
	console.log("guesses", guesses.data);
	return (
		<>
			<h1>Demo</h1>
			<section className="demo-section">
				<div className="section-wrapper">
					<div>
						<h2>Ranking</h2>
						<h3>By League</h3>
					</div>
					<div>
						<h2>Member</h2>
						<p>{member?.data?.id}</p>
						<p>{member?.data?.nickName}</p>

						{/* <Leagues /> */}
					</div>
				</div>

				<div className="section-wrapper">
					{/* <Tournaments tournaments={tournaments.data} /> */}

					{shouldRender ? (
						<div>
							<ul className="rounds">
								<div className="round">
									<p className="round-id">
										Round <strong>{tournament.activeRound}</strong>
									</p>

									<ul className="round-games">
										{activeGames?.map((game) => {
											return (
												<li key={game.id} className="game">
													<div className="information">
														<div className="local-and-date">
															<strong className="stadium">
																{game.stadium}
															</strong>
															<p className="date">
																<span>
																	{new Date(game.date).toLocaleString()}
																</span>
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
													</div>

													<Guess
														tournamentId={tournament?.query?.data?.id}
														game={game}
														guesses={guesses.data}
													/>
												</li>
											);
										})}
									</ul>
								</div>
							</ul>
						</div>
					) : (
						<div>...loading scores</div>
					)}
				</div>
			</section>

			<Outlet />
		</>
	);
};

export { Demo };
