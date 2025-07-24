import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentRounds = () => {
	const search = route.useSearch() as { round: string };
	const navigate = route.useNavigate();

	const goToRound = (round: string) => {
		navigate({
			to: "/tournaments/$tournamentId/matches",
			search: (prev) => ({ ...prev, round }),
			resetScroll: false,
			replace: false,
		});
	};

	return {
		activeRound: search.round,
		goToRound,
	};
};
