import { Box, Chip, IconButton, styled, Typography } from "@mui/material";
import { IconClock, IconPause, IconPlay, IconSettings, IconTrendingUp } from "@tabler/icons-react";
import { useState } from "react";
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

	const getStatusColor = (status: string) => {
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
					<Typography variant="h6" color="neutral.100" sx={{ mb: 1 }}>
						{job.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{job.tournamentName}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Chip
						label={job.status}
						color={getStatusColor(job.status) as any}
						size="small"
						variant="filled"
					/>
				</Box>
			</CardHeader>

			<StatsGrid>
				<StatItem>
					<IconTrendingUp size={16} color="#10b981" />
					<Box>
						<Typography variant="caption" color="text.secondary">
							Success Rate
						</Typography>
						<Typography variant="body2" color="success.main">
							{getSuccessRate()}%
						</Typography>
					</Box>
				</StatItem>

				<StatItem>
					<IconClock size={16} />
					<Box>
						<Typography variant="caption" color="text.secondary">
							Next Run
						</Typography>
						<Typography variant="body2" color="neutral.100">
							{new Date(job.schedule.nextRun).toLocaleString()}
						</Typography>
					</Box>
				</StatItem>
			</StatsGrid>

			<ScheduleInfo>
				<Typography variant="caption" color="text.secondary">
					Schedule: {job.schedule.cron} ({job.schedule.timezone})
				</Typography>
			</ScheduleInfo>

			{isExpanded && (
				<ExpandedContent>
					<Typography variant="subtitle2" color="neutral.100" sx={{ mb: 1 }}>
						Statistics
					</Typography>
					<StatsGrid>
						<StatItem>
							<Typography variant="caption" color="text.secondary">
								Total Success
							</Typography>
							<Typography variant="body2" color="success.main">
								{job.statistics.successCount}
							</Typography>
						</StatItem>
						<StatItem>
							<Typography variant="caption" color="text.secondary">
								Total Failures
							</Typography>
							<Typography variant="body2" color="error.main">
								{job.statistics.failureCount}
							</Typography>
						</StatItem>
						<StatItem>
							<Typography variant="caption" color="text.secondary">
								Avg Runtime
							</Typography>
							<Typography variant="body2" color="neutral.100">
								{job.statistics.averageRunTime}s
							</Typography>
						</StatItem>
					</StatsGrid>

					<Typography variant="subtitle2" color="neutral.100" sx={{ mb: 1, mt: 2 }}>
						Data Source
					</Typography>
					<Box>
						<Typography variant="caption" color="text.secondary">
							Provider: {job.dataSource.provider}
						</Typography>
						<Typography variant="caption" display="block" color="text.secondary">
							URL: {job.dataSource.url}
						</Typography>
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
						{job.status === "active" ? <IconPause size={16} /> : <IconPlay size={16} />}
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
	[theme.breakpoints.up("md")]: {
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
	borderTop: `1px solid ${theme.palette.black[600]}`,
}));

const ActionBar = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});
