import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchExecutionJobs } from "@/domains/admin/server-side/fetchers";

export const useAdminExecutionJobs = (params?: { page?: number; limit?: number }) => {
	const page = params?.page ?? 0;
	const limit = params?.limit ?? 10;
	const offset = page * limit;

	return useQuery({
		queryKey: ["admin", "execution-jobs", { page, limit }],
		queryFn: () => fetchExecutionJobs({ limit, offset }),
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 30 * 1000, // 30 seconds
		placeholderData: keepPreviousData, // Keep previous data while loading new page
	});
};
