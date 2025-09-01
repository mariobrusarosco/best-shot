import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDailyUpdateJob } from "../server-side/mutations";

export const useCreateDailyUpdateJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDailyUpdateJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scheduler", "jobs"] });
		},
	});
};
