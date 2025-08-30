import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRounds } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateRounds = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => updateRounds(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["rounds"] });
		},
	});
};