import { Box, Grid, styled } from "@mui/material";
import { AppTypography } from "@/domains/ui-system/components";
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
				<AppTypography variant="h6" color="text.secondary">
					No scraper statistics available
				</AppTypography>
			</Surface>
		);
	}

	return (
		<DashboardContainer>
			<AppTypography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
				Admin Dashboard
			</AppTypography>

			<Grid container spacing={3}>
				<Grid size={{ all: 12, mobile: 6, tablet: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "primary.main" }}>
							<IconActivity size={24} />
						</StatIcon>
						<Box>
							<AppTypography variant="h3" color="neutral.100">
								{statistics.totalJobs}
							</AppTypography>
							<AppTypography variant="caption" color="text.secondary">
								Total Jobs
							</AppTypography>
						</Box>
					</StatCard>
				</Grid>

				<Grid size={{ all: 12, mobile: 6, tablet: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "success.main" }}>
							<IconCheck size={24} />
						</StatIcon>
						<Box>
							<AppTypography variant="h3" color="neutral.100">
								{statistics.activeJobs}
							</AppTypography>
							<AppTypography variant="caption" color="text.secondary">
								Active Jobs
							</AppTypography>
						</Box>
					</StatCard>
				</Grid>

				<Grid size={{ all: 12, mobile: 6, tablet: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "warning.main" }}>
							<IconClock size={24} />
						</StatIcon>
						<Box>
							<AppTypography variant="h3" color="neutral.100">
								{statistics.pausedJobs}
							</AppTypography>
							<AppTypography variant="caption" color="text.secondary">
								Paused Jobs
							</AppTypography>
						</Box>
					</StatCard>
				</Grid>

				<Grid size={{ all: 12, mobile: 6, tablet: 3 }}>
					<StatCard>
						<StatIcon sx={{ backgroundColor: "error.main" }}>
							<IconAlertTriangle size={24} />
						</StatIcon>
						<Box>
							<AppTypography variant="h3" color="neutral.100">
								{statistics.failedJobs}
							</AppTypography>
							<AppTypography variant="caption" color="text.secondary">
								Failed Jobs
							</AppTypography>
						</Box>
					</StatCard>
				</Grid>
			</Grid>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				<Grid size={{ all: 12, tablet: 6 }}>
					<Surface sx={{ p: 3 }}>
						<AppTypography variant="h6" sx={{ mb: 2, color: "neutral.100" }}>
							24 Hour Statistics
						</AppTypography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<StatRow>
								<AppTypography variant="body2" color="text.secondary">
									Total Executions
								</AppTypography>
								<AppTypography variant="body1" color="neutral.100">
									{statistics.totalExecutions24h}
								</AppTypography>
							</StatRow>
							<StatRow>
								<AppTypography variant="body2" color="text.secondary">
									Successful
								</AppTypography>
								<AppTypography variant="body1" color="success.main">
									{statistics.successfulExecutions24h}
								</AppTypography>
							</StatRow>
							<StatRow>
								<AppTypography variant="body2" color="text.secondary">
									Failed
								</AppTypography>
								<AppTypography variant="body1" color="error.main">
									{statistics.failedExecutions24h}
								</AppTypography>
							</StatRow>
						</Box>
					</Surface>
				</Grid>

				<Grid size={{ all: 12, tablet: 6 }}>
					<Surface sx={{ p: 3 }}>
						<AppTypography variant="h6" sx={{ mb: 2, color: "neutral.100" }}>
							System Health
						</AppTypography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<StatRow>
								<AppTypography variant="body2" color="text.secondary">
									Success Rate
								</AppTypography>
								<AppTypography variant="body1" color="neutral.100">
									{statistics.averageSuccessRate.toFixed(1)}%
								</AppTypography>
							</StatRow>
							<StatRow>
								<AppTypography variant="body2" color="text.secondary">
									Last Execution
								</AppTypography>
								<AppTypography variant="body1" color="neutral.100">
									{new Date(statistics.lastExecutionTime).toLocaleString()}
								</AppTypography>
							</StatRow>
							{statistics.nextScheduledRun && (
								<StatRow>
									<AppTypography variant="body2" color="text.secondary">
										Next Scheduled Run
									</AppTypography>
									<AppTypography variant="body1" color="neutral.100">
										{new Date(statistics.nextScheduledRun).toLocaleString()}
									</AppTypography>
								</StatRow>
							)}
						</Box>
					</Surface>
				</Grid>
			</Grid>
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
