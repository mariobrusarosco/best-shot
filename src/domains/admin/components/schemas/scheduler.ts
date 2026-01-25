import { z } from "zod";

// Base API Response properties that are always present or common
const BaseApiResponse = z.object({
	timestamp: z.string().optional(),
});

// Generic API Error Schema
export const ApiErrorResponseSchema = BaseApiResponse.extend({
	success: z.literal(false),
	error: z.string(),
	message: z.string().optional(),
	details: z.string().optional(),
});

// Scheduler Stats Schema (Data Only)
export const SchedulerStatsSchema = z.object({
	totalOpenMatches: z.number(),
	matchesNeedingUpdate: z.number(),
	matchesRecentlyChecked: z.number(),
});

// Scheduler Stats API Response Schema
const SchedulerStatsSuccessSchema = BaseApiResponse.extend({
	success: z.literal(true),
	message: z.string().optional(),
	data: SchedulerStatsSchema,
});

export const SchedulerStatsResponseSchema = z.discriminatedUnion("success", [
	SchedulerStatsSuccessSchema,
	ApiErrorResponseSchema,
]);

// Trigger Match Polling Response Schema
const TriggerMatchPollingSuccessSchema = BaseApiResponse.extend({
	success: z.literal(true),
	message: z.string(),
	data: z.object({
		statsBefore: SchedulerStatsSchema,
		results: z.object({
			processed: z.number(),
			queued: z.number().optional(),
			successful: z.number().optional(),
			failed: z.number().optional(),
			standingsUpdated: z.number().optional(),
		}),
		duration: z.string(),
		timestamp: z.string(),
		processingMode: z.enum(["concurrent", "sequential"]).optional(),
		message: z.string().optional(),
	}),
});

export const TriggerMatchPollingResponseSchema = z.discriminatedUnion("success", [
	TriggerMatchPollingSuccessSchema,
	ApiErrorResponseSchema,
]);

// Queue Stats Response Schema
const QueueStatsSuccessSchema = BaseApiResponse.extend({
	success: z.literal(true),
	message: z.string(),
	data: z.object({
		available: z.boolean(),
		mode: z.enum(["concurrent", "sequential"]),
		message: z.string().optional(),
		queue: z
			.object({
				name: z.string(),
				pendingJobs: z.number(),
			})
			.optional(),
		workers: z
			.object({
				count: z.number(),
				concurrency: z.number(),
			})
			.optional(),
		retryPolicy: z
			.object({
				attempts: z.number(),
				backoff: z.string(),
				delays: z.string(),
			})
			.optional(),
	}),
});

export const QueueStatsResponseSchema = z.discriminatedUnion("success", [
	QueueStatsSuccessSchema,
	ApiErrorResponseSchema,
]);

// Job Status Response Schema
const JobStatusSuccessSchema = BaseApiResponse.extend({
	success: z.literal(true),
	message: z.string(),
	data: z.object({
		jobId: z.string(),
		state: z.string(),
		matchId: z.string(),
		matchExternalId: z.string(),
		tournamentId: z.string(),
		createdOn: z.string().or(z.date()),
		startedOn: z.string().or(z.date()).nullable().optional(),
		completedOn: z.string().or(z.date()).nullable().optional(),
		duration: z.string().optional(),
	}),
});

export const JobStatusResponseSchema = z.discriminatedUnion("success", [
	JobStatusSuccessSchema,
	ApiErrorResponseSchema,
]);
