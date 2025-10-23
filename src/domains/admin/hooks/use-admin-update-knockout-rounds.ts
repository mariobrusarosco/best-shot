import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKnockoutRounds } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateKnockoutRounds = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tournamentId: string) => updateKnockoutRounds(tournamentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			queryClient.invalidateQueries({ queryKey: ["rounds"] });
		},
	});
};
