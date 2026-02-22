import { useMutation, useQueryClient } from "@tanstack/react-query";
import { triggerScraperJob } from "@/domains/admin/server-side/mutations";

export const useTriggerScraperJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: triggerScraperJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "scrapers", "statistics"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "cron", "jobs"] });
		},
		onError: (error) => {
			console.error("Failed to trigger scraper job:", error);
		},
	});
};
