import { useQuery } from "@tanstack/react-query";
import { getTournament } from "../../demo/fetchers";
import { useState } from "react";
import { ITournament } from "../typing";

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
