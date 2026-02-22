import { useQuery } from "@tanstack/react-query";
import { fetchScraperJobs } from "@/domains/admin/server-side/fetchers";

export const useScraperJobs = () => {
	return useQuery({
		queryKey: ["admin", "scrapers"],
		queryFn: fetchScraperJobs,
		refetchInterval: 60_000,
		staleTime: 30_000,
	});
};
