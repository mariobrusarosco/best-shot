import { useQuery } from "@tanstack/react-query";
import { fetchExecutionJobs } from "@/domains/admin/server-side/fetchers";

export const useAdminExecutionJobs = () => {
	return useQuery({
		queryKey: ["admin", "execution-jobs"],
		queryFn: fetchExecutionJobs,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 30 * 1000, // 30 seconds
	});
};
