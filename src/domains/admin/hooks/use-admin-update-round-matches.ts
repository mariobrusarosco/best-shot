import { useMutation } from "@tanstack/react-query";
import { updateRoundMatches } from "@/domains/admin/server-side/tournament-operations";

export const useAdminUpdateRoundMatches = () => {
	return useMutation({
		mutationFn: ({ tournamentId, roundId }: { tournamentId: string, roundId: string }) => updateRoundMatches(tournamentId, roundId),
		onSuccess: (data: any) => {
            debugger
			alert(`Update matches for round ${data.roundSlug} completed`);
		},
	});
};