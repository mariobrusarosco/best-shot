import { api } from "@/api";
import { SchedulerJobsResponseSchema } from "../schemas";
import type { ISchedulerJob } from "../typing";

// Fetch tournament metadata
export const fetchAdminTournaments = async () => {
	const response = await api.get("/admin/tournaments", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	if (response.data?.data?.length === 0) {
		return [];
	}

	return response.data.data;
};

export const fetchAvailableTournaments = async () => {
	const response = await api.get("/admin/tournaments/available", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

// Fetch all scheduler jobs with optional filters
export const fetchSchedulerJobs = async (params?: {
	limit?: number;
	offset?: number;
	status?: string;
}): Promise<{
	data: ISchedulerJob[];
	pagination?: { limit: number; offset: number; total: number };
}> => {
	const searchParams = new URLSearchParams();
	if (params?.limit) searchParams.set("limit", params.limit.toString());
	if (params?.offset) searchParams.set("offset", params.offset.toString());
	if (params?.status) searchParams.set("status", params.status);

	const response = await api.get(`/admin/scheduler/jobs?${searchParams}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	const parsed = SchedulerJobsResponseSchema.parse(response.data);
	return {
		data: parsed.jobs,
		pagination: undefined,
	};
};
