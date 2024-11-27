import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournamentRounds = () => {
	const search = route.useSearch<{ round: number }>();
	const navigate = route.useNavigate();

	const goToRound = (round: number) => {
		navigate({ search: (prev) => ({ ...prev, round }) });
	};

	return {
		activeRound: search.round,
		goToRound,
	};
};
