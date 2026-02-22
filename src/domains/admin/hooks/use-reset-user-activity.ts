import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetUserActivity } from "@/domains/admin/server-side/mutations";

export const useResetUserActivity = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resetUserActivity,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
			queryClient.invalidateQueries({ queryKey: ["guesses"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
			queryClient.invalidateQueries({ queryKey: ["member"] });
		},
	});
};
