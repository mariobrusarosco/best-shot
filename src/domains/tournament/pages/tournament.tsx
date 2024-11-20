import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { Box } from "@mui/system";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { TournamentHeading } from "../components/tournament-heading";
import { TournamentTabs } from "../components/tournament-tabs";
import { useTournament } from "../hooks/use-tournament";

const route = getRouteApi("/_auth/tournaments/$tournamentId/");

const TournamentPage = () => {
	const { tournamentId } = route.useParams();
	const tournament = useTournament(tournamentId);
	// const guesses = useGuess(tournament.serverState.data);

	// Derivative State
	// const tournamentLabel = tournament.serverState.data?.label;
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
			<ScreenHeading title="tournament" />

			<Box sx={{ display: "flex" }}>
				<TournamentHeading tournament={tournament.serverState.data} />
				<TournamentTabs tournamentId={tournament.serverState.data.id} />
			</Box>

			<Outlet />
		</div>
	);
};

export { TournamentPage };
