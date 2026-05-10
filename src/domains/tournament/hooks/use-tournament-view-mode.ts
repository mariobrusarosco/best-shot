import { useStore } from "@tanstack/react-store";
import { setTournamentView, userPreferencesStore } from "@/stores/user-preferences-store";

export const useTournamentView = () => {
	const view = useStore(userPreferencesStore, (state) => state.tournamentView);

	return {
		view,
		setTournamentView,
	};
};
