import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSchedulerJobs } from "@/domains/admin/server-side/fetchers";

export const useAdminSchedulerJobs = (params?: {
	page?: number;
	limit?: number;
	status?: string;
}) => {
	const page = params?.page ?? 0;
	const limit = params?.limit ?? 10;
	const offset = page * limit;
	const status = params?.status;

	return useQuery({
		queryKey: ["admin", "scheduler-jobs", { page, limit, status }],
		queryFn: () => fetchSchedulerJobs({ limit, offset, status }),
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 30 * 1000, // 30 seconds
		placeholderData: keepPreviousData,
	});
};
