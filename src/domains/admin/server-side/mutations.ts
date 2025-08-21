import type { z } from "zod";
import { api } from "@/api";
import {
	CreateScraperJobSchema,
	RescheduleJobSchema,
	ScraperJobSchema,
	UpdateScraperStatusSchema,
} from "../schemas";
import type { IScraperJob } from "../typing";

// Reschedule a scraper job
export const rescheduleScraperJob = async (
	data: z.infer<typeof RescheduleJobSchema>
): Promise<IScraperJob> => {
	const validatedData = RescheduleJobSchema.parse(data);
	const response = await api.put(`/admin/scrapers/${validatedData.jobId}/schedule`, {
		cronExpression: validatedData.cronExpression,
		timezone: validatedData.timezone,
	});
	return ScraperJobSchema.parse(response.data);
};

// Update scraper job status (pause/resume)
export const updateScraperStatus = async (
	data: z.infer<typeof UpdateScraperStatusSchema>
): Promise<IScraperJob> => {
	const validatedData = UpdateScraperStatusSchema.parse(data);
	const response = await api.patch(`/admin/scrapers/${validatedData.jobId}/status`, {
		status: validatedData.status,
	});
	return ScraperJobSchema.parse(response.data);
};

// Create a new scraper job
export const createScraperJob = async (
	data: z.infer<typeof CreateScraperJobSchema>
): Promise<IScraperJob> => {
	const validatedData = CreateScraperJobSchema.parse(data);
	const response = await api.post("/admin/scrapers", validatedData);
	return ScraperJobSchema.parse(response.data);
};

// Delete a scraper job
export const deleteScraperJob = async (jobId: string): Promise<void> => {
	await api.delete(`/admin/scrapers/${jobId}`);
};

// Manually trigger a scraper job
export const triggerScraperJob = async (jobId: string): Promise<void> => {
	await api.post(`/admin/scrapers/${jobId}/trigger`);
};

// Update tournament metadata
export const updateTournamentMetadata = async (
	tournamentId: string,
	data: Record<string, unknown>
): Promise<void> => {
	await api.put(`/admin/tournaments/${tournamentId}/metadata`, data);
};
