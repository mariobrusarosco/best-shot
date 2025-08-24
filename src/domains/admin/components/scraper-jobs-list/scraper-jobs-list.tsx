import { Box, Grid } from "@mui/material";
import { AppTypography } from "@/domains/ui-system/components";
import { useState } from "react";
import { AppLoader } from "@/domains/global/components/app-loader";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { useScraperJobs } from "../../hooks/use-scraper-jobs";
import { useTriggerScraperJob } from "../../hooks/use-trigger-scraper-job";
import { useUpdateScraperStatus } from "../../hooks/use-update-scraper-status";
import { RescheduleJobModal } from "../reschedule-job-modal/reschedule-job-modal";
import { ScraperJobCard } from "../scraper-job-card/scraper-job-card";

export const ScraperJobsList = () => {
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const { data: jobs, isLoading } = useScraperJobs();
	const updateStatus = useUpdateScraperStatus();
	const triggerJob = useTriggerScraperJob();

	const handleReschedule = (jobId: string) => {
		setSelectedJobId(jobId);
	};

	const handleToggleStatus = (jobId: string, status: "active" | "paused") => {
		updateStatus.mutate({ jobId, status });
	};

	const handleTrigger = (jobId: string) => {
		triggerJob.mutate(jobId);
	};

	const handleCloseModal = () => {
		setSelectedJobId(null);
	};

	if (isLoading) {
		return <AppLoader />;
	}

	if (!jobs || jobs.length === 0) {
		return (
			<Box sx={{ p: 3 }}>
				<AppTypography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
					Scraper Jobs
				</AppTypography>
				<Surface sx={{ p: 3, textAlign: "center" }}>
					<AppTypography variant="h6" color="text.secondary">
						No scraper jobs found
					</AppTypography>
				</Surface>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<AppTypography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
				Scraper Jobs ({jobs.length})
			</AppTypography>

			<Grid container spacing={3}>
				{jobs.map((job) => (
					<Grid size={{ all: 12, tablet: 6, desktop: 4 }} key={job.id}>
						<ScraperJobCard
							job={job}
							onReschedule={handleReschedule}
							onToggleStatus={handleToggleStatus}
							onTrigger={handleTrigger}
						/>
					</Grid>
				))}
			</Grid>

			{selectedJobId && <RescheduleJobModal jobId={selectedJobId} onClose={handleCloseModal} />}
		</Box>
	);
};
