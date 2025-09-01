import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import type { ScheduleJobSchema } from "@/domains/admin/schemas";
import { scheduleJob } from "@/domains/admin/server-side/mutations";

export const useScheduleJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof ScheduleJobSchema>) => scheduleJob(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "scheduler-jobs"] });
		},
	});
};
