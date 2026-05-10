import { useQuery } from "@tanstack/react-query";
import { getTournament } from "@/domains/tournament/server-state/fetchers";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import type { ITournament } from "@/domains/tournament/types";

export const useTournament = ({ id }: { id: string }) => {
	const query = useQuery<ITournament>({
		queryKey: tournamentKey(id),
		queryFn: getTournament,
		enabled: !!id,
	});

	return {
		query,
		actions: {},
	};
};
