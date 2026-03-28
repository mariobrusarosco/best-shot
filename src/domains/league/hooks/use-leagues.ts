import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeagues } from "@/domains/league/server-side/fetchers";
import { leaguesQueryKey } from "@/domains/league/server-side/keys";
import { createLeague } from "@/domains/league/server-side/mutations";

export const useLeagues = () => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: leaguesQueryKey(),
		queryFn: getLeagues,
	});

	const createLeagueMutation = useMutation({
		mutationFn: createLeague,
		onSuccess: () => {
			alert("League created successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
		},
		onError: () => {
			alert("Failed to create league");
		},
	});

	return {
		leagues: {
			data: query.data,
			states: {
				isLoading: query.isLoading,
				isError: query.isError,
			},
			handlers: {
				refetch: query.refetch,
			},
		},
		league: {
			states: {
				isCreatingLeague: createLeagueMutation.isPending,
				errorWhenCretingLeague: createLeagueMutation.isError,
			},
			handlers: {
				createLeague: createLeagueMutation.mutate,
			},
		},
	};
};
