import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKnockoutRoundsJob } from "../server-side/mutations";

export const useCreateKnockoutRoundsJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createKnockoutRoundsJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scheduler", "jobs"] });
		},
	});
};
