import { Store } from "@tanstack/store";

export type TournamentViewMode = "timeline" | "rounds" | "calendar";

export interface UserPreferences {
	tournamentViewMode: TournamentViewMode;
}

const STORAGE_KEY = "best-shot-user-preferences";

const defaultState: UserPreferences = {
	tournamentViewMode: "timeline",
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

export const setTournamentViewMode = (mode: TournamentViewMode) => {
	userPreferencesStore.setState((state) => ({
		...state,
		tournamentViewMode: mode,
	}));

	persistState();
};
