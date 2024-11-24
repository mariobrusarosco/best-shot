import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTournament } from "../server-state/fetchers";
import { ITournament } from "../typing";

export const useTournament = (id: string | undefined) => {
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
