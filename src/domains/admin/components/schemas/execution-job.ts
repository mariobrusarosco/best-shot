import { z } from "zod";

export const ExecutionJobSchema = z.object({
	id: z.string().uuid(),
	requestId: z.string().uuid(),
	operationType: z.string(),
	status: z.enum(["pending", "running", "completed", "failed"]),
	startedAt: z.string().nullable(),
	completedAt: z.string().nullable(),
	duration: z.number().nullable(),
	reportFileUrl: z.string().url().nullable(),
	reportFileKey: z.string().nullable(),
	summary: z
		.object({
			tournamentId: z.string().uuid(),
			tournamentLabel: z.string(),
			provider: z.string(),
			operationsCount: z.number(),
			successfulOperations: z.number(),
			failedOperations: z.number(),
		})
		.nullable(),
	tournament: z
		.object({
			id: z.string().uuid(),
			label: z.string(),
			logo: z.string().url(),
		})
		.nullable(),
});

// Execution Jobs API Response Schema
export const ExecutionJobsResponseSchema = z.object({
	success: z.boolean(),
	data: ExecutionJobSchema.array(),
	pagination: z.object({
		limit: z.number(),
		offset: z.number(),
		total: z.number(),
	}),
});

// Tournament Execution Job Schema
export const TournamentExecutionJobSchema = z.object({
	id: z.string().uuid(),
	operationType: z.string(),
	status: z.string(),
	summary: z.object({
		totalOperations: z.number(),
		successfulOperations: z.number(),
		failedOperations: z.number(),
	}),
	reportUrl: z.string().nullable(),
	createdAt: z.string(),
	endTime: z.string().nullable(),
	duration: z.number().nullable(),
});

// Tournament Execution Jobs API Response Schema
export const TournamentExecutionJobsResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		tournament: z.object({
			id: z.string().uuid(),
			label: z.string(),
		}),
		executionJobs: TournamentExecutionJobSchema.array(),
		total: z.number(),
		limit: z.number(),
	}),
	message: z.string(),
});
