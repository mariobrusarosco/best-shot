import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStandings } from "@/domains/admin/server-side/tournament-operations";

export const useAdminCreateStandings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => createStandings(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
		},
	});
};