import { useMutation, useQueryClient } from "@tanstack/react-query";
import { triggerScraperJob } from "../server-side/mutations";

export const useTriggerScraperJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: triggerScraperJob,
		onSuccess: () => {
			// Invalidate and refetch scraper jobs and statistics
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers", "statistics"] });
		},
		onError: (error) => {
			console.error("Failed to trigger scraper job:", error);
			// TODO: Add error notification
		},
	});
};
