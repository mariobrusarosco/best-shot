import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleScraperJob } from "../server-side/mutations";

export const useRescheduleScraperJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rescheduleScraperJob,
		onSuccess: () => {
			// Invalidate and refetch scraper jobs and statistics
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers", "statistics"] });
		},
		onError: (error) => {
			console.error("Failed to reschedule scraper job:", error);
			// TODO: Add error notification
		},
	});
};
