import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetUserActivity } from "../server-side/mutations";

export const useResetUserActivity = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resetUserActivity,
		onSuccess: () => {
			// Invalidate queries that might be affected by user activity reset
			// This could be leagues, guesses, standings, etc.
			// For now, we can be aggressive or just specific ones if we knew them.
			// Since it resets guesses, leagues, standings, we should probably invalidate a lot.
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
			queryClient.invalidateQueries({ queryKey: ["guesses"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
			// Add other keys as necessary
		},
	});
};

