import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTournament, getTournaments } from "./fetchers";
import { globoEsporteRound, responseTournament } from "./typing";

export const useTournaments = () => {
	const [activeTournament, setActiveTournament] = useState<string | null>(null);
	const handleSelectTournament = (id: string) => {
		setActiveTournament(id);
	};

	const tournaments = useQuery<responseTournament[]>({
		queryKey: ["tournament"],
		queryFn: getTournaments,
	});

	return {
		activeTournament,
		handleSelectTournament,
		...tournaments,
	};
};

export const useTournament = (id: string | null) => {
	const [activeRound, setActiveRound] = useState(1);

	const handleNextRound = () => {
		setActiveRound((prev) => prev + 1);
	};
	const handlePreviousRound = () => {
		setActiveRound((prev) => prev - 1);
	};

	const tournament = useQuery({
		queryKey: ["tournament", { id, activeRound }],
		queryFn: getTournament,
		enabled: !!id,
	});

	return { ...tournament, handleNextRound, handlePreviousRound, activeRound };
};
