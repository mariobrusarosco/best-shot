import { useQuery } from "@tanstack/react-query";
import type { ITournament } from "../schemas";
import { getTournaments } from "../server-state/fetchers";

export const useTournaments = () => {
	const tournaments = useQuery<ITournament[]>({
		queryKey: ["tournaments"],
		queryFn: getTournaments,
	});

	return {
		...tournaments,
	};
};
