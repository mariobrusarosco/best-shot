import { guessKey } from "@/domains/guess/hooks/use-guess";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { setupTournament } from "../server-state/mutations";
import { tournamentKey } from "./use-tournament";
import { tournamentStandingsKey } from "./use-tournament-standings";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentSetup = () => {
	const queryClient = useQueryClient();
	const { tournamentId } = route.useParams();
	const { round } = route.useSearch() as { round: string };

	const mutation = useMutation({
		mutationFn: setupTournament,
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: guessKey(tournamentId, round),
			});
			queryClient.invalidateQueries({
				queryKey: tournamentKey(tournamentId),
			});
			queryClient.refetchQueries({
				queryKey: tournamentStandingsKey(tournamentId),
			});
		},
	});

	return mutation;
};
