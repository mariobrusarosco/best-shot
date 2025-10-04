import { createLazyFileRoute } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";

export const Route = createLazyFileRoute("/_auth/admin/tournament/$tournamentId/scheduled-jobs")({
	component: ScheduledJobsPage,
});

function ScheduledJobsPage() {
	const { tournamentId } = Route.useParams();

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Scheduled Jobs - Tournament {tournamentId}
			</Typography>
			<Typography variant="paragraph">
				This page will show scheduled jobs for the selected tournament.
			</Typography>
		</Box>
	);
}
