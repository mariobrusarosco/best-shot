import { z } from "zod";

// Scraper Execution History Schema
export const ScraperExecutionSchema = z.object({
	id: z.string().uuid(),
	jobId: z.string().uuid(),
	startTime: z.string().datetime(),
	endTime: z.string().datetime().optional(),
	duration: z.number().min(0).optional(), // in seconds
	status: z.enum(["running", "success", "failed"]),
	recordsProcessed: z.number().min(0).optional(),
	recordsCreated: z.number().min(0).optional(),
	recordsUpdated: z.number().min(0).optional(),
	errorMessage: z.string().optional(),
	errorDetails: z.any().optional(),
});

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
