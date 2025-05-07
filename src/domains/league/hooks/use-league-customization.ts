import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { ITournament } from "@/domains/tournament/schemas";
import { useState } from "react";

export const useLeagueTournaments = (currentTournaments: ITournament[]) => {
	const [customMode, setCustomMode] = useState(false);
	const { data } = useTournaments();

	const remainingTournaments = data?.filter((tournament) =>
		currentTournaments.find((t) => t.id !== tournament.id),
	);
	const toggleCustomMode = () => setCustomMode((prev) => !prev);

	return {
		customMode,
		remainingTournaments,
		toggleCustomMode,
	};
};
