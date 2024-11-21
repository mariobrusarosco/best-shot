import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const TournamentRanking = () => {
	const tournamentId = route.useParams().tournamentId;
	const tournament = useTournament(tournamentId);

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
		<div data-ui="rakning" className="screen">
			<Typography variant="h3" color="neutral.100">
				RAKNING of {tournamentLabel}
			</Typography>
		</div>
	);
};

export const Route = createLazyFileRoute(
	"/_auth/tournaments/$tournamentId/_layout/ranking",
)({
	component: TournamentRanking,
});
