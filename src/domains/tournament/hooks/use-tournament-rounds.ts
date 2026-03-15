import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ITournament } from "@/domains/tournament/schemas";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const getActiveTournamentRound = (searchRound?: string, tournament?: ITournament) => {
	return searchRound ??  tournament?.currentRound ?? "1";
};

export const useTournamentRounds = ({
	tournament,
	syncOnMount = false,
}: {
	tournament?: ITournament;
	syncOnMount?: boolean;
} = {}) => {
	const search = route.useSearch() as { round?: string };
	const navigate = route.useNavigate();
	const activeRound = getActiveTournamentRound(search.round, tournament);

	const goToRound = (round: string) => {
		navigate({
			to: "/tournaments/$tournamentId/matches",
			search: (prev) => ({ ...prev, round }),
			resetScroll: false,
			replace: false,
		});
	};

	useEffect(() => {
		if (!syncOnMount || search.round || !activeRound) {
			return;
		}

		navigate({
			to: "/tournaments/$tournamentId/matches",
			search: (prev) => ({ ...prev, round: activeRound }),
			resetScroll: false,
			replace: true,
		});
	}, [activeRound, navigate, search.round, syncOnMount]);

	return {
		activeRound,
		goToRound,
	};
};
