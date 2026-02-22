import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScraperStatus } from "@/domains/admin/server-side/mutations";

export const useUpdateScraperStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateScraperStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers", "statistics"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "cron", "jobs"] });
		},
		onError: (error) => {
			console.error("Failed to update scraper status:", error);
		},
	});
};
