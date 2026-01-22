import { useQuery } from "@tanstack/react-query";
import { fetchSchedulerStats } from "@/domains/admin/server-side/fetchers";

export const useSchedulerStats = () => {
	return useQuery({
		queryKey: ["admin", "scheduler", "stats"],
		queryFn: fetchSchedulerStats,
		refetchInterval: 30000, // Refetch every 30 seconds
		staleTime: 10000,
	});
};
