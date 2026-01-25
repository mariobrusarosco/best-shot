import { z } from "zod";

// Scraper Job Schema
export const ScraperJobSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Job name is required"),
	tournamentId: z.string().uuid(),
	tournamentName: z.string(),
	schedule: z.object({
		cron: z.string(),
		timezone: z.string().default("UTC"),
		nextRun: z.string().datetime(),
		lastRun: z.string().datetime().optional(),
	}),
	status: z.enum(["active", "paused", "running", "failed"]),
	statistics: z.object({
		successCount: z.number().min(0),
		failureCount: z.number().min(0),
		averageRunTime: z.number().min(0), // in seconds
		lastSuccessAt: z.string().datetime().optional(),
		lastFailureAt: z.string().datetime().optional(),
	}),
	dataSource: z.object({
		url: z.string().url(),
		provider: z.string(),
		apiVersion: z.string().optional(),
	}),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

// Reschedule Job Input Schema
export const RescheduleJobSchema = z.object({
	jobId: z.string().uuid(),
	cronExpression: z.string(),
	timezone: z.string().optional(),
});

// Scraper Statistics Dashboard Schema
export const ScraperStatisticsSchema = z.object({
	totalJobs: z.number().min(0),
	activeJobs: z.number().min(0),
	pausedJobs: z.number().min(0),
	failedJobs: z.number().min(0),
	averageSuccessRate: z.number().min(0).max(100),
	totalExecutions24h: z.number().min(0),
	successfulExecutions24h: z.number().min(0),
	failedExecutions24h: z.number().min(0),
	lastExecutionTime: z.string().datetime(),
	nextScheduledRun: z.string().datetime().optional(),
});

// Update Scraper Status Schema
export const UpdateScraperStatusSchema = z.object({
	jobId: z.string().uuid(),
	status: z.enum(["active", "paused"]),
});

// Create Scraper Job Schema
export const CreateScraperJobSchema = z.object({
	name: z.string().min(1, "Job name is required").max(100),
	tournamentId: z.string().uuid("Please select a tournament"),
	cronExpression: z.string(),
	timezone: z.string().default("UTC"),
	dataSource: z.object({
		url: z.string().url("Please enter a valid URL"),
		provider: z.string().min(1, "Provider is required"),
		apiVersion: z.string().optional(),
	}),
});
