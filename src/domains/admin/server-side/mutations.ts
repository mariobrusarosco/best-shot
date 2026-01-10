import type { z } from "zod";
import { api } from "@/api";
import {
	CreateScraperJobSchema,
	CreateTournamentSchema,
	RescheduleJobSchema,
	ScraperJobSchema,
	UpdateScraperStatusSchema,
} from "@/domains/admin/schemas";
import type { IScraperJob } from "@/domains/admin/typing";
import type { ITournament } from "@/domains/tournament/schemas";

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

// Reset user activity
export const resetUserActivity = async (): Promise<{
	success: boolean;
	message: string;
}> => {
	const response = await api.post(
		"/admin/reset-user-activity",
		{},
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);
	return response.data;
};
