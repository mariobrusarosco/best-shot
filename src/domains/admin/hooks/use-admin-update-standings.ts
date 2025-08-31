import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStandings } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateStandings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => updateStandings(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
		},
	});
};
