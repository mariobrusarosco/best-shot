import { useQuery } from "@tanstack/react-query";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournaments } from "@/domains/tournament/server-state/fetchers";

export const useTournaments = () => {
	const tournaments = useQuery<ITournament[]>({
		queryKey: ["tournaments"],
		queryFn: getTournaments,
	});

	return {
		...tournaments,
	};
};
