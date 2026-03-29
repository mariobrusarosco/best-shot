import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { tournamentKey } from "@/domains/tournament/server-state/keys";
import type { TournamentRoundsSearch } from "@/domains/tournament/types";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentRounds = () => {
	const search = route.useSearch() as TournamentRoundsSearch;
	const queryClient = useQueryClient();
	const tournamentId = route.useParams().tournamentId;
	const navigate = route.useNavigate();

	// Derivate States
	const tournament = queryClient.getQueryData(tournamentKey(tournamentId)) as ITournament;
	const tournamentCurrentRound = tournament.currentRound;
	const roundSelectedOnUrl = search.round;
	const activeRound = roundSelectedOnUrl ?? tournamentCurrentRound;

	const goToRound = (round: string) => {
		navigate({
			search: (prev) => ({ ...prev, round }),
			resetScroll: false,
			replace: false,
		});
	};

	return {
		rounds: {
			data: tournament.rounds,
			handlers: { goToRound },
		},
		activeRound: {
			data: activeRound,
		},
	};
};
