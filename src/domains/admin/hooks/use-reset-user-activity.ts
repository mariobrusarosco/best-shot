import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetUserActivity } from "../server-side/mutations";

export const useResetUserActivity = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resetUserActivity,
		onSuccess: () => {
			// Invalidate queries that might be affected by user activity reset
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
			queryClient.invalidateQueries({ queryKey: ["guesses"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
			// Also invalidate user member data potentially
			queryClient.invalidateQueries({ queryKey: ["member"] });
		},
	});
};
