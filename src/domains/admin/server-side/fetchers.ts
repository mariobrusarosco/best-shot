import { api } from "@/api";
import {
	ScraperExecutionSchema,
	ScraperJobSchema,
	ScraperStatisticsSchema,
	TournamentMetadataSchema,
} from "../schemas";
import type { IScraperJob, ITournamentMetadata } from "../typing";

// Fetch all scraper jobs
export const fetchScraperJobs = async (): Promise<IScraperJob[]> => {
	const response = await api.get("/admin/scrapers");
	return ScraperJobSchema.array().parse(response.data);
};

// Fetch single scraper job details
export const fetchScraperJob = async (jobId: string): Promise<IScraperJob> => {
	const response = await api.get(`/admin/scrapers/${jobId}`);
	return ScraperJobSchema.parse(response.data);
};

// Fetch scraper execution history
export const fetchScraperExecutionHistory = async (jobId?: string) => {
	const url = jobId ? `/admin/scrapers/${jobId}/executions` : "/admin/scrapers/executions";
	const response = await api.get(url);
	return ScraperExecutionSchema.array().parse(response.data);
};

// Fetch scraper statistics
export const fetchScraperStatistics = async () => {
	const response = await api.get("/admin/scrapers/statistics");
	return ScraperStatisticsSchema.parse(response.data);
};

// Fetch tournament metadata
export const fetchTournamentMetadata = async (
	tournamentId?: string
): Promise<ITournamentMetadata[]> => {
	const url = tournamentId
		? `/admin/tournaments/${tournamentId}/metadata`
		: "/admin/tournaments/metadata";
	const response = await api.get(url);

	if (tournamentId) {
		return [TournamentMetadataSchema.parse(response.data)];
	}
	return TournamentMetadataSchema.array().parse(response.data);
};

// Fetch available tournaments for scraper setup
export const fetchAvailableTournaments = async () => {
	const response = await api.get("/admin/tournaments/available");
	return response.data;
};
