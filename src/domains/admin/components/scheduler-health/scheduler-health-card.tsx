import { Box, Chip, styled } from "@mui/material";
import { IconActivity, IconAlertTriangle, IconCheck, IconRefresh } from "@tabler/icons-react";
import { useSchedulerStats } from "@/domains/admin/hooks/use-scheduler-stats";
import { useTriggerMatchPolling } from "@/domains/admin/hooks/use-trigger-match-polling";
import { AppError } from "@/domains/global/components/error";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { Surface } from "@/domains/ui-system/components/surface/surface";

export const SchedulerHealthCard = () => {
	const { data: stats, isLoading, error } = useSchedulerStats();
	const { mutate: triggerUpdate, isPending: isTriggering } = useTriggerMatchPolling();

	if (isLoading) {
		return (
			<CardContainer>
				<AppTypography color="neutral.400">Loading scheduler health...</AppTypography>
			</CardContainer>
		);
	}

	if (error) {
		return (
			<CardContainer>
				<AppError error={error} />
			</CardContainer>
		);
	}

	if (!stats) return null;

	const isHealthy = stats.matchesNeedingUpdate < 50;
	const statusColor = isHealthy ? "success" : "warning";

	return (
		<CardContainer>
			<CardHeader>
				<Box>
					<AppTypography variant="h6" color="neutral.100" sx={{ mb: 1 }}>
						Scheduler Health
					</AppTypography>
					<AppTypography variant="body2" color="text.secondary">
						Match Polling Status
					</AppTypography>
				</Box>
				<Chip
					label={isHealthy ? "Healthy" : "Attention Needed"}
					color={statusColor}
					size="small"
					variant="filled"
					icon={isHealthy ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
				/>
			</CardHeader>

			<StatsGrid>
				<StatItem>
					<IconActivity size={16} color={isHealthy ? "#10b981" : "#f59e0b"} />
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Pending Updates
						</AppTypography>
						<AppTypography variant="body2" color={isHealthy ? "neutral.100" : "warning.light"}>
							{stats.matchesNeedingUpdate} matches
						</AppTypography>
					</Box>
				</StatItem>

				<StatItem>
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Total Open Matches
						</AppTypography>
						<AppTypography variant="body2" color="neutral.100">
							{stats.totalOpenMatches}
						</AppTypography>
					</Box>
				</StatItem>

				<StatItem>
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Recently Checked
						</AppTypography>
						<AppTypography variant="body2" color="neutral.100">
							{stats.matchesRecentlyChecked}
						</AppTypography>
					</Box>
				</StatItem>
			</StatsGrid>

			<ActionBar>
				<AppTypography variant="caption" color="text.secondary">
					Checks every 10 mins
				</AppTypography>
				<AppButton
					variant="contained"
					size="small"
					startIcon={<IconRefresh size={16} />}
					onClick={() => triggerUpdate()}
					loading={isTriggering}
					color={isHealthy ? "primary" : "warning"}
				>
					Trigger Update
				</AppButton>
			</ActionBar>
		</CardContainer>
	);
};

// Styled Components
const CardContainer = styled(Surface)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
	height: "100%",
}));

const CardHeader = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
});

const StatsGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr 1fr 1fr",
	gap: theme.spacing(2),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[700],
	borderRadius: theme.shape.borderRadius,
}));

const StatItem = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

const ActionBar = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginTop: "auto",
});
