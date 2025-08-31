import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatches } from "@/domains/admin/server-side/tournament-operations";

export const useAdminCreateMatches = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => createMatches(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["matches"] });
		},
	});
};