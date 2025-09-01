import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScoresAndStandingsJob } from "../server-side/mutations";

export const useCreateScoresAndStandingsJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createScoresAndStandingsJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scheduler", "jobs"] });
		},
	});
};
