import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "@/domains/tournament/server-state/fetchers";
import { tournamentsKey } from "@/domains/tournament/server-state/keys";

export const useTournaments = () => {
	const query = useQuery({
		queryKey: tournamentsKey(),
		queryFn: getTournaments,
	});

	return {
		tournaments: {
			data: query.data ?? [],
			states: {
				isLoading: query.isLoading,
				isError: query.isError,
				isEmpty: !query.isLoading && !query.isError && query.data?.length === 0,
			},
			handlers: {},
		},
	};
};
