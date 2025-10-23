import { useQuery } from "@tanstack/react-query";
import { fetchAdminTournaments } from "@/domains/admin/server-side/fetchers";

export const useAdminTournaments = () => {
	return useQuery({
		queryKey: ["admin", "tournaments"],
		queryFn: fetchAdminTournaments,
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: true,
	});
};
