import {
	Box,
	Chip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useAdminTournamentExecutionJobs } from "@/domains/admin/hooks";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";

export const Route = createLazyFileRoute("/_auth/admin/tournament/$tournamentId/_layout/execution-jobs")({
	component: ExecutionJobsPage,
});

function ExecutionJobsPage() {
	const { tournamentId } = Route.useParams();
	const { data, isLoading, error } = useAdminTournamentExecutionJobs(tournamentId);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "success";
			case "running":
				return "warning";
			case "failed":
				return "error";
			default:
				return "default";
		}
	};

	const formatDuration = (duration: number | null) => {
		if (!duration) return "N/A";
		return `${duration}s`;
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleString();
	};

	if (isLoading) {
		return (
			<Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
				<AppIcon name="ClockFilled" size="medium" color="teal.500" />
				<AppTypography variant="h6" color="neutral.100">
					Loading execution jobs...
				</AppTypography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<AppTypography variant="h6" color="error.main">
					Error loading execution jobs: {error.message}
				</AppTypography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			{/* Header */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<AppIcon name="LayoutDashboard" size="medium" color="teal.500" />
				<Box>
					<AppTypography variant="h4" color="neutral.100" fontWeight="bold">
						Execution Jobs
					</AppTypography>
					<AppTypography variant="body2" color="neutral.400">
						{data?.tournament?.label || `Tournament ${tournamentId}`} • {data?.total || 0} jobs
					</AppTypography>
				</Box>
			</Box>

			{/* Jobs Table */}
			<TableContainer
				component={Paper}
				sx={{
					backgroundColor: "black.800",
					border: "1px solid",
					borderColor: "neutral.700",
				}}
			>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: "black.700" }}>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Operation Type
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Status
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Operations
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Duration
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Created
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Completed
								</AppTypography>
							</TableCell>
							<TableCell>
								<AppTypography variant="subtitle2" color="neutral.100" fontWeight="medium">
									Report
								</AppTypography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.executionJobs?.map((job) => (
							<TableRow
								key={job.id}
								sx={{
									"&:hover": { backgroundColor: "black.700" },
									borderBottom: "1px solid",
									borderColor: "neutral.700",
								}}
							>
								<TableCell>
									<AppTypography variant="body2" color="neutral.200">
										{job.operationType}
									</AppTypography>
								</TableCell>
								<TableCell>
									<Chip
										label={job.status}
										color={getStatusColor(job.status)}
										size="small"
										variant="outlined"
									/>
								</TableCell>
								<TableCell>
									<AppTypography variant="body2" color="neutral.300">
										{job.summary.successfulOperations}/{job.summary.totalOperations} successful
									</AppTypography>
									{job.summary.failedOperations > 0 && (
										<AppTypography variant="caption" color="error.main">
											{job.summary.failedOperations} failed
										</AppTypography>
									)}
								</TableCell>
								<TableCell>
									<AppTypography variant="body2" color="neutral.300">
										{formatDuration(job.duration)}
									</AppTypography>
								</TableCell>
								<TableCell>
									<AppTypography variant="body2" color="neutral.300">
										{formatDate(job.createdAt)}
									</AppTypography>
								</TableCell>
								<TableCell>
									<AppTypography variant="body2" color="neutral.300">
										{formatDate(job.endTime)}
									</AppTypography>
								</TableCell>
								<TableCell>
									{job.reportUrl ? (
										<Box
											component="a"
											href={job.reportUrl}
											target="_blank"
											rel="noopener noreferrer"
											sx={{
												color: "teal.500",
												textDecoration: "none",
												"&:hover": { textDecoration: "underline" },
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<AppIcon name="Save" size="small" />
											<AppTypography variant="body2">Report</AppTypography>
										</Box>
									) : (
										<AppTypography variant="body2" color="neutral.500">
											N/A
										</AppTypography>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{/* Empty state */}
				{!data?.executionJobs?.length && (
					<Box sx={{ p: 6, textAlign: "center" }}>
						<AppIcon name="Info" size="large" color="neutral.500" />
						<AppTypography variant="h6" color="neutral.400" sx={{ mt: 2 }}>
							No execution jobs found
						</AppTypography>
						<AppTypography variant="body2" color="neutral.500" sx={{ mt: 1 }}>
							Execution jobs will appear here when tournament operations are performed.
						</AppTypography>
					</Box>
				)}
			</TableContainer>
		</Box>
	);
}
