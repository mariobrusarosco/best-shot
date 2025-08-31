import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMatches } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateMatches = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => updateMatches(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["matches"] });
		},
	});
};