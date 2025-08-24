import { useQuery } from "@tanstack/react-query";
import { fetchScraperJobs } from "../server-side/fetchers";

export const useScraperJobs = () => {
	return useQuery({
		queryKey: ["admin", "scrapers"],
		queryFn: fetchScraperJobs,
		refetchInterval: 60000, // Refetch every minute
		staleTime: 30000, // Consider data stale after 30 seconds
	});
};
