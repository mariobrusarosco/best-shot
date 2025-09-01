import type { z } from "zod";
import { api } from "@/api";
import type { ITournament } from "@/domains/tournament/schemas";
import {
	CreateScraperJobSchema,
	CreateTournamentSchema,
	DailyUpdateJobSchema,
	KnockoutRoundsJobSchema,
	RescheduleJobSchema,
	ScheduleJobSchema,
	ScoresAndStandingsJobSchema,
	ScraperJobSchema,
	UpdateScraperStatusSchema,
} from "../schemas";
import type { IScraperJob } from "../typing";

// Reschedule a scraper job
export const rescheduleScraperJob = async (
	data: z.infer<typeof RescheduleJobSchema>
): Promise<IScraperJob> => {
	const validatedData = RescheduleJobSchema.parse(data);
	const response = await api.put(
		`/admin/scrapers/${validatedData.jobId}/schedule`,
		{
			cronExpression: validatedData.cronExpression,
			timezone: validatedData.timezone,
		},
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);
	return ScraperJobSchema.parse(response.data);
};

// Update scraper job status (pause/resume)
export const updateScraperStatus = async (
	data: z.infer<typeof UpdateScraperStatusSchema>
): Promise<IScraperJob> => {
	const validatedData = UpdateScraperStatusSchema.parse(data);
	const response = await api.patch(
		`/admin/scrapers/${validatedData.jobId}/status`,
		{
			status: validatedData.status,
		},
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);
	return ScraperJobSchema.parse(response.data);
};

// Create a new scraper job
export const createScraperJob = async (
	data: z.infer<typeof CreateScraperJobSchema>
): Promise<IScraperJob> => {
	const validatedData = CreateScraperJobSchema.parse(data);
	const response = await api.post("/admin/scrapers", validatedData, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return ScraperJobSchema.parse(response.data);
};

// Delete a scraper job
export const deleteScraperJob = async (jobId: string): Promise<void> => {
	await api.delete(`/admin/scrapers/${jobId}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
};

// Manually trigger a scraper job
export const triggerScraperJob = async (jobId: string): Promise<void> => {
	await api.post(
		`/admin/scrapers/${jobId}/trigger`,
		{},
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);
};

export const createAdminTournament = async (
	data: z.infer<typeof CreateTournamentSchema>
): Promise<ITournament> => {
	const validatedData = CreateTournamentSchema.parse(data);
	const response = await api.post("/admin/tournaments", validatedData, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data as ITournament;
};

export const scheduleJob = async (data: z.infer<typeof ScheduleJobSchema>): Promise<void> => {
	const validatedData = ScheduleJobSchema.parse(data);
	await api.post("/admin/schedule", validatedData, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
};

// New Scheduler Jobs API mutations
export const createDailyUpdateJob = async (
	data: z.infer<typeof DailyUpdateJobSchema>
): Promise<void> => {
	const validatedData = DailyUpdateJobSchema.parse(data);
	const payload = {
		...validatedData,
		environment: validatedData.environment || process.env.NODE_ENV,
	};
	await api.post("/admin/scheduler/jobs", payload, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
};

export const createScoresAndStandingsJob = async (
	data: z.infer<typeof ScoresAndStandingsJobSchema>
): Promise<void> => {
	const validatedData = ScoresAndStandingsJobSchema.parse(data);
	const payload = {
		...validatedData,
		environment: validatedData.environment || process.env.NODE_ENV,
	};
	await api.post("/admin/scheduler/jobs", payload, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
};

export const createKnockoutRoundsJob = async (
	data: z.infer<typeof KnockoutRoundsJobSchema>
): Promise<void> => {
	const validatedData = KnockoutRoundsJobSchema.parse(data);
	const payload = {
		...validatedData,
		environment: validatedData.environment || process.env.NODE_ENV,
	};
	await api.post("/admin/scheduler/jobs", payload, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
};
