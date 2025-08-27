import { api } from "@/api";
import {
	ScraperExecutionSchema,
	ScraperJobSchema,
	ScraperStatisticsSchema,
	TournamentMetadataSchema,
	ExecutionJobsResponseSchema,
} from "../schemas";
import type { IScraperJob, ITournamentMetadata, IExecutionJob } from "../typing";

// Fetch all scraper jobs
export const fetchScraperJobs = async (): Promise<IScraperJob[]> => {
	const response = await api.get("/admin/scrapers", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return ScraperJobSchema.array().parse(response.data);
};

// Fetch single scraper job details
export const fetchScraperJob = async (jobId: string): Promise<IScraperJob> => {
	const response = await api.get(`/admin/scrapers/${jobId}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return ScraperJobSchema.parse(response.data);
};

// Fetch scraper execution history
export const fetchScraperExecutionHistory = async (jobId?: string) => {
	const url = jobId ? `/admin/scrapers/${jobId}/executions` : "/admin/scrapers/executions";
	const response = await api.get(url, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return ScraperExecutionSchema.array().parse(response.data);
};

// Fetch scraper statistics
export const fetchScraperStatistics = async () => {
	const response = await api.get("/admin/scrapers/statistics", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return ScraperStatisticsSchema.parse(response.data);
};

// Fetch tournament metadata
export const fetchTournamentMetadata = async (
	tournamentId?: string
): Promise<ITournamentMetadata[]> => {
	const url = tournamentId
		? `/admin/tournaments/${tournamentId}/metadata`
		: "/admin/tournaments/metadata";
	const response = await api.get(url, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	if (tournamentId) {
		return [TournamentMetadataSchema.parse(response.data)];
	}
	return TournamentMetadataSchema.array().parse(response.data);
};

export const fetchAvailableTournaments = async () => {
	const response = await api.get("/admin/tournaments/available", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const fetchExecutionJobs = async (): Promise<IExecutionJob[]> => {
	const response = await api.get("/admin/execution-jobs", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsed = ExecutionJobsResponseSchema.parse(response.data);
	return parsed.data;
};
