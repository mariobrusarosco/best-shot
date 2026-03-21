import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "@/domains/tournament/server-state/fetchers";

export const useTournaments = () => {
	const query = useQuery({
		queryKey: tournamentsKey(),
		queryFn: getTournaments,
	});

	const tournaments = query.data ?? [];
	return {
		data: {
			tournaments,
		},
		states: {
			isLoading: query.isLoading,
			isError: query.isError,
			isEmpty: !query.isLoading && !query.isError && tournaments.length === 0,
		},
		handlers: {},
	};
};

export const tournamentsKey = () => ["tournaments"];
