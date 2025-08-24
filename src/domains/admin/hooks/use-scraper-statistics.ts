import { useQuery } from "@tanstack/react-query";
import { fetchScraperStatistics } from "../server-side/fetchers";

export const useScraperStatistics = () => {
	return useQuery({
		queryKey: ["admin", "scrapers", "statistics"],
		queryFn: fetchScraperStatistics,
		refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
		staleTime: 20000, // Consider data stale after 20 seconds
	});
};
