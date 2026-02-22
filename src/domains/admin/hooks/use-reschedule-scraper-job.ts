import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleScraperJob } from "@/domains/admin/server-side/mutations";

export const useRescheduleScraperJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rescheduleScraperJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers", "statistics"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "cron", "jobs"] });
		},
		onError: (error) => {
			console.error("Failed to reschedule scraper job:", error);
		},
	});
};
