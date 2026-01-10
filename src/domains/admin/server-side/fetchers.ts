import { api } from "@/api";
import {
	AdmingTournamentsResponseSchema,
	AdminTournamentResponseSchema,
	ExecutionJobsResponseSchema,
	ScraperExecutionSchema,
	ScraperJobSchema,
	ScraperStatisticsSchema,
	TournamentExecutionJobsResponseSchema,
	TournamentMetadataSchema,
} from "@/domains/admin/schemas";
import type {
	IAdminTournament,
	IExecutionJob,
	IScraperJob,
	ITournamentExecutionJobsResponse,
	ITournamentMetadata,
} from "@/domains/admin/typing";

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

export const fetchExecutionJobs = async (params?: {
	limit?: number;
	offset?: number;
}): Promise<{
	data: IExecutionJob[];
	pagination: { limit: number; offset: number; total: number };
}> => {
	const searchParams = new URLSearchParams();
	if (params?.limit) searchParams.set("limit", params.limit.toString());
	if (params?.offset) searchParams.set("offset", params.offset.toString());

	const response = await api.get(`/admin/execution-jobs?${searchParams}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsed = ExecutionJobsResponseSchema.parse(response.data);
	return {
		data: parsed.data,
		pagination: parsed.pagination,
	};
};

// Fetch admin tournament data
export const fetchAdminTournament = async (tournamentId: string): Promise<IAdminTournament> => {
	const response = await api.get(`/admin/tournaments/${tournamentId}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsedResponse = AdminTournamentResponseSchema.parse(response.data);
	return parsedResponse.data;
};

export const fetchAdminTournaments = async (): Promise<IAdminTournament[]> => {
	const response = await api.get("/admin/tournaments", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsedResponse = AdmingTournamentsResponseSchema.parse(response.data);
	return parsedResponse.data;
};

// Fetch tournament execution jobs
export const fetchTournamentExecutionJobs = async (
	tournamentId: string
): Promise<ITournamentExecutionJobsResponse["data"]> => {
	const response = await api.get(`/admin/tournaments/${tournamentId}/execution-jobs`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsedResponse = TournamentExecutionJobsResponseSchema.parse(response.data);
	return parsedResponse.data;
};
