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

// Create Tournament Schema
export const CreateTournamentSchema = z.object({
	tournamentPublicId: z.string().min(1, "Tournament public ID is required"),
	baseUrl: z.string().url("Please enter a valid base URL"),
	label: z
		.string()
		.min(3, "Tournament name must be at least 3 characters")
		.max(50, "Tournament name cannot exceed 50 characters"),
	slug: z
		.string()
		.min(1, "Tournament slug is required")
		.max(50, "Tournament slug cannot exceed 50 characters"),
	provider: z.string().min(1, "Please select a data provider"),
	season: z
		.string()
		.min(4, "Season must be at least 4 characters")
		.max(20, "Season cannot exceed 20 characters"),
	mode: z.enum(["regular-season-only", "regular-season-and-knockout", "knockout-only"]),
	standingsMode: z.enum(["unique-group", "multi-group"]),
});

export const SchedulerJobSchema = z.object({
	id: z.string().uuid(),
	scheduleId: z.string(),
	scheduleArn: z.string().nullable(),
	jobType: z.string(),
	duration: z.number(),
	cronExpression: z.string(),
	targetLambdaArn: z.string(),
	targetEndpoint: z.string(),
	targetPayload: z.record(z.any()),
	tournamentId: z.string().uuid(),
	scheduleStatus: z.string(),
	executionStatus: z.string(),
	scheduledAt: z.string().datetime(),
	scheduleConfirmedAt: z.string().datetime().nullable(),
	scheduleFailedAt: z.string().datetime().nullable(),
	scheduleErrorDetails: z.record(z.any()).nullable(),
	triggeredAt: z.string().datetime().nullable(),
	executedAt: z.string().datetime().nullable(),
	completedAt: z.string().datetime().nullable(),
	executionId: z.string().nullable(),
	executionResult: z.any().nullable(),
	executionErrorDetails: z.any().nullable(),
	environment: z.string(),
	createdBy: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const SchedulerJobsResponseSchema = z.object({
	success: z.boolean(),
	jobs: SchedulerJobSchema.array(),
	count: z.number(),
});

export const ScheduleJobSchema = z.object({
	tournament_id: z.string().uuid("Please select a tournament"),
	schedule_type: z.enum(["standings_and_scores", "new_knockout_rounds"]),
	duration: z.coerce
		.number()
		.min(1, "Duration must be at least 1 day")
		.max(365, "Duration cannot exceed 365 days"),
});

// New Scheduler Job Schemas for the v2 API
export const DailyUpdateJobSchema = z.object({
	jobType: z.literal("daily_update"),
	environment: z.enum(["demo", "staging", "production"]).optional(),
	description: z.string().min(1, "Description is required"),
});

export const ScoresAndStandingsJobSchema = z.object({
	jobType: z.literal("scores_and_standings"),
	environment: z.enum(["demo", "staging", "production"]).optional(),
	tournamentId: z.string().uuid("Please select a tournament"),
	matchStartTime: z.string().min(1, "Match start time is required"),
	roundSlug: z.string().min(1, "Round slug is required"),
	description: z.string().min(1, "Description is required"),
});

export const KnockoutRoundsJobSchema = z.object({
	jobType: z.literal("knockout_rounds"),
	environment: z.enum(["demo", "staging", "production"]).optional(),
	tournamentId: z.string().uuid("Please select a tournament"),
	description: z.string().min(1, "Description is required"),
});
