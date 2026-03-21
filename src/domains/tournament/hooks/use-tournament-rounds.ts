import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ITournament } from "@/domains/tournament/schemas";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const getActiveTournamentRound = (searchRound?: string, tournament?: ITournament) => {
	return searchRound ?? tournament?.currentRound ?? "1";
};

export const useTournamentRounds = ({
	tournament,
	syncOnMount = false,
}: UseTournamentRoundsProps = {}) => {
	const search = route.useSearch() as TournamentRoundsSearch;
	const navigate = route.useNavigate();
	const rounds = tournament?.rounds ?? [];
	const activeRound = getActiveTournamentRound(search.round, tournament);
	const isEmpty = !!tournament && rounds.length === 0;

	const goToRound = (round: string) => {
		navigate({
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
			search: (prev) => ({ ...prev, round: activeRound }),
			resetScroll: false,
			replace: true,
		});
	}, [activeRound, navigate, search.round, syncOnMount]);

	return {
		data: {
			activeRound,
			rounds,
		},
		states: {
			isEmpty,
		},
		handlers: {
			goToRound,
		},
	};
};

type UseTournamentRoundsProps = {
	tournament?: TournamentWithRounds;
	syncOnMount?: boolean;
};

type TournamentRoundsSearch = {
	round?: string;
};

type TournamentWithRounds = ITournament & {
	rounds?: TournamentRound[];
};

type TournamentRound = {
	label: string;
	slug: string;
};
