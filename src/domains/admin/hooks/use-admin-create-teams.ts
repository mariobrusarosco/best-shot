import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeams } from "@/domains/admin/server-side/tournament-operations";

export const useAdminCreateTeams = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => createTeams(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
};
