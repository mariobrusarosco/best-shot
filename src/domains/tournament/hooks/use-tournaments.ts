import { useQuery } from "@tanstack/react-query";
import type { I_Tournament } from "../schema";
import { getTournaments } from "../server-state/fetchers";

export const useTournaments = () => {
	const tournaments = useQuery<I_Tournament[]>({
		queryKey: ["tournaments"],
		queryFn: getTournaments,
	});

	return {
		...tournaments,
	};
};
