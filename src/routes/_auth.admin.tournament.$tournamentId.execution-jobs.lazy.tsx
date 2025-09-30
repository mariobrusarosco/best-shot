import { createLazyFileRoute } from "@tanstack/react-router";
import { Box, Typography } from "@mui/material";

export const Route = createLazyFileRoute("/_auth/admin/tournament/$tournamentId/execution-jobs")({
	component: ExecutionJobsPage,
});

function ExecutionJobsPage() {
	const { tournamentId } = Route.useParams();

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Execution Jobs - Tournament {tournamentId}
			</Typography>
			<Typography variant="body1">
				This page will show execution jobs for the selected tournament.
			</Typography>
		</Box>
	);
}
