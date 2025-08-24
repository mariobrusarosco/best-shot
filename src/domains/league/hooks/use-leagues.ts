import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeagues } from "../server-side/fetchers";
import { createLeague } from "../server-side/mutations";

export const useLeagues = () => {
	const queryClient = useQueryClient();

	const leagues = useQuery({
		queryKey: ["leagues"],
		queryFn: getLeagues,
	});

	const createLeagueMutation = useMutation({
		mutationFn: createLeague,
		onSuccess: () => {
			alert("League created successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
		},
	});

	return {
		leagues,
		createLeagueMutation,
	};
};
