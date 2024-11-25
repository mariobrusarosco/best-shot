import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";

export const TournamentRanking = () => {
	const tournament = useTournament();

	// Derivative State
	const tournamentLabel = tournament.serverState.data?.label;

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
