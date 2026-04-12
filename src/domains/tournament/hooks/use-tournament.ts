import { useQuery } from "@tanstack/react-query";
import type { ITournament } from "@/domains/tournament/schemas";
import { getTournament } from "@/domains/tournament/server-state/fetchers";
import { tournamentKey } from "@/domains/tournament/server-state/keys";

export const useTournament = ({ id }: { id: string }) => {
	const query = useQuery<ITournament>({
		queryKey: tournamentKey(id),
		queryFn: getTournament,
		enabled: !!id,
	});

	return {
		tournament: {
			data: query.data,
			states: {
				isLoading: query.isLoading,
				isError: query.isError,
				isEmpty: !query.isLoading && !query.isError && !query.data,
			},
			handlers: {},
		},
	};
};
