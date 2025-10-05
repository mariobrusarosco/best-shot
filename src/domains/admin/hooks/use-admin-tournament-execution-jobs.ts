import { useQuery } from "@tanstack/react-query";
import { fetchTournamentExecutionJobs } from "@/domains/admin/server-side/fetchers";

export const useAdminTournamentExecutionJobs = (tournamentId: string) => {
	return useQuery({
		queryKey: ["admin", "tournament", tournamentId, "execution-jobs"],
		queryFn: () => fetchTournamentExecutionJobs(tournamentId),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!tournamentId,
	});
};
