import { useMutation } from "@tanstack/react-query";
import { setupTournament } from "../server-state/mutations";

export const useTournamentSetup = () => {
	const mutation = useMutation({
		mutationFn: setupTournament,
	});

	return mutation;
};
