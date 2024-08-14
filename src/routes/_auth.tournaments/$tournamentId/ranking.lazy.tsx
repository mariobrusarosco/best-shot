import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useTournament } from "../../../domains/tournament/hooks/use-tournament";
import { useGuess } from "../../../domains/guess/hooks/use-guess";

const route = getRouteApi("/_auth/tournaments/$tournamentId/ranking");

const TournamentRanking = () => {
	const tournamentId = route.useParams().tournamentId;
	const tournament = useTournament(tournamentId);
	const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	const tournamentLabel = tournament.serverState.data?.label;
	// const matchesForSelectedRound = tournament.serverState.data?.matches;

	// const activeGames = tournament.serverState?.data?.matches;
	// const shouldRender = tournament.serverState.isSuccess && guesses.isSuccess;

	// // console.log("shouldRender", shouldRender);
	// // console.log("activeGames", activeGames);
	// console.log("guesses", guesses.data);
	// console.log("activeGames", activeGames);

	return (
		<div data-ui="tournament-page" className="screen">
			<div className="heading">
				<h3>{tournamentLabel}</h3>
			</div>

			<p>ranking</p>
		</div>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/ranking",
)({
	component: TournamentRanking,
});
