import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTournament } from "@/domains/admin/server-side/tournament-operations";

export const useAdminDeleteTournament = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => deleteTournament(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
		},
	});
};
