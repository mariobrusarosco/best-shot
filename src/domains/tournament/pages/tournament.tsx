import { useTournament } from "../hooks/use-tournament";
import { getRouteApi } from "@tanstack/react-router";
import { TournamentHeading } from "../components/tournament-heading";
import { TournamentTabs } from "../components/tournament-tabs";

const route = getRouteApi("/_auth/tournaments/$tournamentId/");

const TournamentPage = () => {
	const { tournamentId } = route.useParams();
	const tournament = useTournament(tournamentId);
	// const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	const tournamentLabel = tournament.serverState.data?.label;
	// const matchesForSelectedRound = tournament.serverState.data?.matches;

	// const activeGames = tournament.serverState?.data?.matches;
	// // const shouldRender = tournament.serverState.isSuccess && guesses.isSuccess;

	// console.log("shouldRender", shouldRender);
	// console.log("activeGames", activeGames);
	// console.log("guesses", guesses.data);
	// console.log("activeGames", activeGames);

	if (tournament.serverState.isPending) {
		return <p>...loading tournament...</p>;
	}

	if (tournament.serverState.error) {
		return <p>...error...</p>;
	}

	return (
		<div data-ui="tournament-page" className="page">
			<div className="heading">
				<h3>{tournamentLabel}</h3>
			</div>

			<>
				<TournamentHeading tournament={tournament.serverState.data} />
				<TournamentTabs tournamentId={tournament.serverState.data.id} />
			</>
		</div>
	);
};

export { TournamentPage };
