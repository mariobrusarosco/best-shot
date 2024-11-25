import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { getTournament } from "../server-state/fetchers";
import { ITournament } from "../typing";

const route = getRouteApi("/_auth/tournaments/$tournamentId");

export const useTournament = () => {
	const id = route.useParams().tournamentId;
	const [activeRound, setActiveRound] = useState(1);

	const handleNextRound = () => {
		setActiveRound((prev) => prev + 1);
	};
	const handlePreviousRound = () => {
		setActiveRound((prev) => prev - 1);
	};
	const goToRound = (round: number) => {
		setActiveRound(round);
	};

	const query = useQuery<ITournament>({
		queryKey: ["tournament", { id, activeRound }],
		queryFn: getTournament,
		enabled: !!id,
	});

	return {
		serverState: query,
		uiState: {
			handleNextRound,
			handlePreviousRound,
			goToRound,
			activeRound,
		},
	};
};
