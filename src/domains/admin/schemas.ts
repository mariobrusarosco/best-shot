import { z } from "zod";

// Scraper Job Schema
export const ScraperJobSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Job name is required"),
	tournamentId: z.string().uuid(),
	tournamentName: z.string(),
	schedule: z.object({
		cron: z
			.string()
			.regex(
				/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
				"Invalid cron expression"
			),
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

// Tournament Metadata Schema
export const TournamentMetadataSchema = z.object({
	tournamentId: z.string().uuid(),
	tournamentName: z.string(),
	rounds: z.array(
		z.object({
			id: z.string(),
			label: z.string().min(1),
			slug: z.string(),
			startDate: z.string().datetime(),
			endDate: z.string().datetime(),
			dataSource: z.string(),
			matchCount: z.number().min(0),
			lastUpdated: z.string().datetime(),
		})
	),
	lastScrapedAt: z.string().datetime(),
	dataQuality: z.number().min(0).max(100), // 0-100 score
	activeScrapers: z.number().min(0),
	totalMatches: z.number().min(0),
	upcomingMatches: z.number().min(0),
});

// Reschedule Job Input Schema
export const RescheduleJobSchema = z.object({
	jobId: z.string().uuid(),
	cronExpression: z
		.string()
		.regex(
			/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
			"Please enter a valid cron expression"
		),
	timezone: z.string().optional(),
});

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
	cronExpression: z
		.string()
		.regex(
			/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
			"Please enter a valid cron expression"
		),
	timezone: z.string().default("UTC"),
	dataSource: z.object({
		url: z.string().url("Please enter a valid URL"),
		provider: z.string().min(1, "Provider is required"),
		apiVersion: z.string().optional(),
	}),
});
