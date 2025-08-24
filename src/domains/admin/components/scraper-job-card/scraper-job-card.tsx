import { Box, Chip, IconButton, styled } from "@mui/material";
import {
	IconClock,
	IconPlayerPause,
	IconPlayerPlay,
	IconSettings,
	IconTrendingUp,
} from "@tabler/icons-react";
import { useState } from "react";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import type { IScraperJob } from "../../typing";

interface ScraperJobCardProps {
	job: IScraperJob;
	onReschedule: (jobId: string) => void;
	onToggleStatus: (jobId: string, status: "active" | "paused") => void;
	onTrigger: (jobId: string) => void;
}

export const ScraperJobCard = ({
	job,
	onReschedule,
	onToggleStatus,
	onTrigger,
}: ScraperJobCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const getStatusColor = (status: string): "success" | "info" | "warning" | "error" | "default" => {
		switch (status) {
			case "active":
				return "success";
			case "running":
				return "info";
			case "paused":
				return "warning";
			case "failed":
				return "error";
			default:
				return "default";
		}
	};

	const getSuccessRate = () => {
		const total = job.statistics.successCount + job.statistics.failureCount;
		if (total === 0) return 0;
		return ((job.statistics.successCount / total) * 100).toFixed(1);
	};

	const handleToggleStatus = () => {
		const newStatus = job.status === "active" ? "paused" : "active";
		onToggleStatus(job.id, newStatus);
	};

	return (
		<JobCard>
			<CardHeader>
				<Box>
					<AppTypography variant="h6" color="neutral.100" sx={{ mb: 1 }}>
						{job.name}
					</AppTypography>
					<AppTypography variant="body2" color="text.secondary">
						{job.tournamentName}
					</AppTypography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Chip
						label={job.status}
						color={getStatusColor(job.status)}
						size="small"
						variant="filled"
					/>
				</Box>
			</CardHeader>

			<StatsGrid>
				<StatItem>
					<IconTrendingUp size={16} color="#10b981" />
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Success Rate
						</AppTypography>
						<AppTypography variant="body2" color="success.main">
							{getSuccessRate()}%
						</AppTypography>
					</Box>
				</StatItem>

				<StatItem>
					<IconClock size={16} />
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Next Run
						</AppTypography>
						<AppTypography variant="body2" color="neutral.100">
							{new Date(job.schedule.nextRun).toLocaleString()}
						</AppTypography>
					</Box>
				</StatItem>
			</StatsGrid>

			<ScheduleInfo>
				<AppTypography variant="caption" color="text.secondary">
					Schedule: {job.schedule.cron} ({job.schedule.timezone})
				</AppTypography>
			</ScheduleInfo>

			{isExpanded && (
				<ExpandedContent>
					<AppTypography variant="subtitle2" color="neutral.100" sx={{ mb: 1 }}>
						Statistics
					</AppTypography>
					<StatsGrid>
						<StatItem>
							<AppTypography variant="caption" color="text.secondary">
								Total Success
							</AppTypography>
							<AppTypography variant="body2" color="success.main">
								{job.statistics.successCount}
							</AppTypography>
						</StatItem>
						<StatItem>
							<AppTypography variant="caption" color="text.secondary">
								Total Failures
							</AppTypography>
							<AppTypography variant="body2" color="error.main">
								{job.statistics.failureCount}
							</AppTypography>
						</StatItem>
						<StatItem>
							<AppTypography variant="caption" color="text.secondary">
								Avg Runtime
							</AppTypography>
							<AppTypography variant="body2" color="neutral.100">
								{job.statistics.averageRunTime}s
							</AppTypography>
						</StatItem>
					</StatsGrid>

					<AppTypography variant="subtitle2" color="neutral.100" sx={{ mb: 1, mt: 2 }}>
						Data Source
					</AppTypography>
					<Box>
						<AppTypography variant="caption" color="text.secondary">
							Provider: {job.dataSource.provider}
						</AppTypography>
						<AppTypography variant="caption" display="block" color="text.secondary">
							URL: {job.dataSource.url}
						</AppTypography>
					</Box>
				</ExpandedContent>
			)}

			<ActionBar>
				<Box sx={{ display: "flex", gap: 1 }}>
					<IconButton
						size="small"
						onClick={handleToggleStatus}
						disabled={job.status === "running"}
						sx={{ color: "neutral.100" }}
					>
						{job.status === "active" ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
					</IconButton>

					<IconButton
						size="small"
						onClick={() => onReschedule(job.id)}
						sx={{ color: "neutral.100" }}
					>
						<IconSettings size={16} />
					</IconButton>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<AppButton variant="outlined" size="small" onClick={() => setIsExpanded(!isExpanded)}>
						{isExpanded ? "Less" : "More"}
					</AppButton>

					<AppButton
						variant="contained"
						size="small"
						onClick={() => onTrigger(job.id)}
						disabled={job.status === "running"}
					>
						Run Now
					</AppButton>
				</Box>
			</ActionBar>
		</JobCard>
	);
};

// Styled Components
const JobCard = styled(Surface)(({ theme }) => ({
	padding: theme.spacing(3),
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

const CardHeader = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
});

const StatsGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: theme.spacing(2),
	[theme.breakpoints.up("tablet")]: {
		gridTemplateColumns: "1fr 1fr 1fr",
	},
}));

const StatItem = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1),
}));

const ScheduleInfo = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	backgroundColor: theme.palette.black[700],
	borderRadius: theme.shape.borderRadius,
}));

const ExpandedContent = styled(Box)(({ theme }) => ({
	paddingTop: theme.spacing(2),
	borderTop: `1px solid ${theme.palette.black[500]}`,
}));

const ActionBar = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});
