import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "../../demo/fetchers";
import { ITournament } from "../typing";

export const useTournaments = () => {
	const tournaments = useQuery<ITournament[]>({
		queryKey: ["tournament"],
		queryFn: getTournaments,
	});

	return {
		...tournaments,
	};
};
