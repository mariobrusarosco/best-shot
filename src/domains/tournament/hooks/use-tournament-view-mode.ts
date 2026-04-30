import { useStore } from "@tanstack/react-store";
import {
	setTournamentViewMode,
	userPreferencesStore,
} from "@/stores/user-preferences-store";

export const useTournamentViewMode = () => {
	const tournamentViewMode = useStore(userPreferencesStore, (state) => state.tournamentViewMode);

	return {
		tournamentViewMode,
		setTournamentViewMode,
	};
};
