import { useQuery } from "@tanstack/react-query";
import { ITournament } from "../typing";
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
