import { useMutation, useQueryClient } from "@tanstack/react-query";
import { triggerMatchPolling } from "@/domains/admin/server-side/mutations";

export const useTriggerMatchPolling = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: triggerMatchPolling,
		onSuccess: () => {
			// Invalidate stats to refresh the "matches needing update" count
			queryClient.invalidateQueries({ queryKey: ["admin", "scheduler", "stats"] });
		},
		onError: (error) => {
			console.error("Failed to trigger match polling:", error);
		},
	});
};
