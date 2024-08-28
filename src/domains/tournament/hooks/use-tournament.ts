import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ITournament } from "../typing";
import { getTournament } from "../server-state/fetchers";

export const useTournament = (id: string | undefined) => {
	const [activeRound, setActiveRound] = useState(1);

	const handleNextRound = () => {
		setActiveRound((prev) => prev + 1);
	};
	const handlePreviousRound = () => {
		setActiveRound((prev) => prev - 1);
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
			activeRound,
		},
	};
};
