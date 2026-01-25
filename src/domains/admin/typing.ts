import type { z } from "zod";
import type {
	AdminTournamentResponseSchema,
	AdminTournamentSchema,
	ExecutionJobSchema,
	JobStatusResponseSchema,
	QueueStatsResponseSchema,
	SchedulerStatsResponseSchema,
	SchedulerStatsSchema,
	ScraperJobSchema,
	TournamentExecutionJobSchema,
	TournamentExecutionJobsResponseSchema,
	TournamentMetadataSchema,
	TriggerMatchPollingResponseSchema,
} from "./schemas";

export type IScraperJob = z.infer<typeof ScraperJobSchema>;
export type ITournamentMetadata = z.infer<typeof TournamentMetadataSchema>;
export type IExecutionJob = z.infer<typeof ExecutionJobSchema>;
export type IAdminTournament = z.infer<typeof AdminTournamentSchema>;
export type IAdminTournamentResponse = z.infer<typeof AdminTournamentResponseSchema>;
export type ISchedulerStats = z.infer<typeof SchedulerStatsSchema>;
export type ISchedulerStatsResponse = z.infer<typeof SchedulerStatsResponseSchema>;
export type ITournamentExecutionJob = z.infer<typeof TournamentExecutionJobSchema>;
export type ITournamentExecutionJobsResponse = z.infer<
	typeof TournamentExecutionJobsResponseSchema
>;
export type ITriggerMatchPollingResponse = z.infer<typeof TriggerMatchPollingResponseSchema>;
export type ITriggerMatchPollingSuccess = Extract<ITriggerMatchPollingResponse, { success: true }>;

export type IQueueStatsResponse = z.infer<typeof QueueStatsResponseSchema>;
export type IQueueStatsSuccess = Extract<IQueueStatsResponse, { success: true }>;

export type IJobStatusResponse = z.infer<typeof JobStatusResponseSchema>;
export type IJobStatusSuccess = Extract<IJobStatusResponse, { success: true }>;

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
