import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeams } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateTeams = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => updateTeams(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
};