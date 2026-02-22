import { useQuery } from "@tanstack/react-query";
import { fetchScraperStatistics } from "@/domains/admin/server-side/fetchers";

export const useScraperStatistics = () => {
	return useQuery({
		queryKey: ["admin", "scrapers", "statistics"],
		queryFn: fetchScraperStatistics,
		refetchInterval: 30_000,
		staleTime: 20_000,
	});
};
