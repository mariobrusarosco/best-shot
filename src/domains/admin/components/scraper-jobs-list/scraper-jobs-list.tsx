import { Box, Grid2, Typography } from "@mui/material";
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
				<Typography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
					Scraper Jobs
				</Typography>
				<Surface sx={{ p: 3, textAlign: "center" }}>
					<Typography variant="body1" color="text.secondary">
						No scraper jobs found
					</Typography>
				</Surface>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" sx={{ mb: 4, color: "neutral.100" }}>
				Scraper Jobs ({jobs.length})
			</Typography>

			<Grid2 container spacing={3}>
				{jobs.map((job) => (
					<Grid2 size={{ xs: 12, md: 6, xl: 4 }} key={job.id}>
						<ScraperJobCard
							job={job}
							onReschedule={handleReschedule}
							onToggleStatus={handleToggleStatus}
							onTrigger={handleTrigger}
						/>
					</Grid2>
				))}
			</Grid2>

			{selectedJobId && <RescheduleJobModal jobId={selectedJobId} onClose={handleCloseModal} />}
		</Box>
	);
};
