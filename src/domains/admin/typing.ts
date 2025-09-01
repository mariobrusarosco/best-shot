import type { z } from "zod";
import type { SchedulerJobSchema, ScraperJobSchema, TournamentMetadataSchema } from "./schemas";

export type IScraperJob = z.infer<typeof ScraperJobSchema>;
export type ITournamentMetadata = z.infer<typeof TournamentMetadataSchema>;
export type ISchedulerJob = z.infer<typeof SchedulerJobSchema>;

export interface IScraperJobExecution {
	id: string;
	jobId: string;
	startTime: Date;
	endTime?: Date;
	status: "running" | "success" | "failed";
	recordsProcessed?: number;
	errorMessage?: string;
}

export interface IScraperStatistics {
	totalJobs: number;
	activeJobs: number;
	failedJobs: number;
	averageSuccessRate: number;
	lastExecutionTime: Date;
}

export type ScraperJobStatus = "active" | "paused" | "running" | "failed";

export interface IRescheduleJobInput {
	jobId: string;
	cronExpression: string;
	timezone?: string;
}
