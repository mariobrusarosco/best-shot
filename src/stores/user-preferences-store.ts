import { Store } from "@tanstack/store";

export type TournamentView = "timeline" | "rounds" | "calendar";

export interface UserPreferences {
	tournamentView: TournamentView;
}

const STORAGE_KEY = "best-shot-user-preferences";

const defaultState: UserPreferences = {
	tournamentView: "timeline",
};

const loadPersistedState = (): UserPreferences => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
	} catch {
		return defaultState;
	}
};

export const userPreferencesStore = new Store<UserPreferences>(loadPersistedState());

const persistState = () => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(userPreferencesStore.state));
};

export const setTournamentView = (view: TournamentView) => {
	userPreferencesStore.setState((state) => ({
		...state,
		tournamentView: view,
	}));

	persistState();
};
