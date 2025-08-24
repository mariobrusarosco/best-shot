import { Typography } from "@mui/material";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const TournamentSimulator = () => {
	const tournamentId = route.useParams().tournamentId;

	return (
		<div>
			<Typography variant="h1" color="neutral.100">
				Simulator for {tournamentId}
			</Typography>
		</div>
	);
};

export const Route = createLazyFileRoute("/_auth/tournaments/$tournamentId/_layout/simulator")({
	component: TournamentSimulator,
});
