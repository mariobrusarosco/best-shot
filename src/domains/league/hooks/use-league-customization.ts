import { useState } from "react";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import type { I_Tournament } from "@/domains/tournament/schema";

export const useLeagueTournaments = (currentTournaments: I_Tournament[]) => {
	const [customMode, setCustomMode] = useState(false);
	const { data } = useTournaments();

	const remainingTournaments = data?.filter((tournament) =>
		currentTournaments.find((t) => t.id !== tournament.id)
	);
	const toggleCustomMode = () => setCustomMode((prev) => !prev);

	return {
		customMode,
		remainingTournaments,
		toggleCustomMode,
	};
};
