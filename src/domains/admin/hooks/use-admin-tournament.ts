import { useQuery } from "@tanstack/react-query";
import { fetchAdminTournament } from "@/domains/admin/server-side/fetchers";

export const useAdminTournament = (tournamentId: string) => {
	return useQuery({
		queryKey: ["admin", "tournament", tournamentId],
		queryFn: () => fetchAdminTournament(tournamentId),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!tournamentId,
	});
};
