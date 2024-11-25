import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const TournamentLayout = () => {
	const tournament = useTournament();

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
				<TournamentHeading />
				{/* <TournamentTabs tournamentId={tournament.serverState.data.id} /> */}
			</Box>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/tournaments/$tournamentId/_layout",
)({
	component: TournamentLayout,
});
