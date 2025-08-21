import { Box, Grid2, styled, Typography } from "@mui/material";
import { IconActivity, IconAlertTriangle, IconCheck, IconClock } from "@tabler/icons-react";
import { AppLoader } from "@/domains/global/components/app-loader";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { useScraperStatistics } from "../../hooks/use-scraper-statistics";

export const AdminDashboard = () => {
	const { data: statistics, isLoading } = useScraperStatistics();

	if (isLoading) {
		return <AppLoader />;
	}

	if (!statistics) {
		return (
			<Surface sx={{ p: 3, textAlign: "center" }}>
				<Typography variant="body1" color="text.secondary">
					No scraper statistics available
				</Typography>
			</Surface>
		);
	}

	return (
		<DashboardContainer>
			<Typography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
				Admin Dashboard
			</Typography>

			<Grid2 container spacing={3}>
				<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "primary.main" }}>
							<IconActivity size={24} />
						</StatIcon>
						<Box>
							<Typography variant="h3" color="neutral.100">
								{statistics.totalJobs}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Total Jobs
							</Typography>
						</Box>
					</StatCard>
				</Grid2>

				<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "success.main" }}>
							<IconCheck size={24} />
						</StatIcon>
						<Box>
							<Typography variant="h3" color="neutral.100">
								{statistics.activeJobs}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Active Jobs
							</Typography>
						</Box>
					</StatCard>
				</Grid2>

				<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "warning.main" }}>
							<IconClock size={24} />
						</StatIcon>
						<Box>
							<Typography variant="h3" color="neutral.100">
								{statistics.pausedJobs}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Paused Jobs
							</Typography>
						</Box>
					</StatCard>
				</Grid2>

				<Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "error.main" }}>
							<IconAlertTriangle size={24} />
						</StatIcon>
						<Box>
							<Typography variant="h3" color="neutral.100">
								{statistics.failedJobs}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Failed Jobs
							</Typography>
						</Box>
					</StatCard>
				</Grid2>
			</Grid2>

			<Grid2 container spacing={3} sx={{ mt: 2 }}>
				<Grid2 size={{ xs: 12, md: 6 }}>
					<Surface sx={{ p: 3 }}>
						<Typography variant="h6" sx={{ mb: 2, color: "neutral.100" }}>
							24 Hour Statistics
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<StatRow>
								<Typography variant="body2" color="text.secondary">
									Total Executions
								</Typography>
								<Typography variant="body1" color="neutral.100">
									{statistics.totalExecutions24h}
								</Typography>
							</StatRow>
							<StatRow>
								<Typography variant="body2" color="text.secondary">
									Successful
								</Typography>
								<Typography variant="body1" color="success.main">
									{statistics.successfulExecutions24h}
								</Typography>
							</StatRow>
							<StatRow>
								<Typography variant="body2" color="text.secondary">
									Failed
								</Typography>
								<Typography variant="body1" color="error.main">
									{statistics.failedExecutions24h}
								</Typography>
							</StatRow>
						</Box>
					</Surface>
				</Grid2>

				<Grid2 size={{ xs: 12, md: 6 }}>
					<Surface sx={{ p: 3 }}>
						<Typography variant="h6" sx={{ mb: 2, color: "neutral.100" }}>
							System Health
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<StatRow>
								<Typography variant="body2" color="text.secondary">
									Success Rate
								</Typography>
								<Typography variant="body1" color="neutral.100">
									{statistics.averageSuccessRate.toFixed(1)}%
								</Typography>
							</StatRow>
							<StatRow>
								<Typography variant="body2" color="text.secondary">
									Last Execution
								</Typography>
								<Typography variant="body1" color="neutral.100">
									{new Date(statistics.lastExecutionTime).toLocaleString()}
								</Typography>
							</StatRow>
							{statistics.nextScheduledRun && (
								<StatRow>
									<Typography variant="body2" color="text.secondary">
										Next Scheduled Run
									</Typography>
									<Typography variant="body1" color="neutral.100">
										{new Date(statistics.nextScheduledRun).toLocaleString()}
									</Typography>
								</StatRow>
							)}
						</Box>
					</Surface>
				</Grid2>
			</Grid2>
		</DashboardContainer>
	);
};

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
}));

const StatCard = styled(Surface)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	height: "100%",
}));

const StatIcon = styled(Box)(({ theme }) => ({
	width: 48,
	height: 48,
	borderRadius: theme.shape.borderRadius,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: theme.palette.common.white,
}));

const StatRow = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});
