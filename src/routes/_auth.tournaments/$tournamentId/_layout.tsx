import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

const TournamentLayout = () => {
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

			<Box sx={{ display: "flex", flexDirection: "column", px: 3 }}>
				<TournamentHeading tournament={tournament.serverState.data} />
				{/* <TournamentTabs tournamentId={tournament.serverState.data.id} /> */}
			</Box>
			{/* <ScrollRestoration getKey={(location) => location.pathname} /> */}
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/tournaments/$tournamentId/_layout",
)({
	component: TournamentLayout,
});
