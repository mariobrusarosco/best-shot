import { Store } from "@tanstack/store";
import type { TournamentSimulationState } from "@/domains/tournament/types";

const STORAGE_PREFIX = "best-shot:tournament-simulation:v1:";
const CURRENT_VERSION = 1;

const storeCache = new Map<string, Store<TournamentSimulationState>>();

const createDefaultState = (): TournamentSimulationState => ({
	version: CURRENT_VERSION,
	updatedAt: null,
	matchOverrides: {},
});

const getStorageKey = (tournamentId: string) => `${STORAGE_PREFIX}${tournamentId}`;

const loadPersistedState = (tournamentId: string): TournamentSimulationState => {
	if (typeof window === "undefined") {
		return createDefaultState();
	}

	try {
		const stored = localStorage.getItem(getStorageKey(tournamentId));
		if (!stored) {
			return createDefaultState();
		}

		const parsed = JSON.parse(stored) as Partial<TournamentSimulationState>;

		return {
			...createDefaultState(),
			...parsed,
			matchOverrides: parsed.matchOverrides ?? {},
		};
	} catch (error) {
		console.warn("Failed to load tournament simulation state from localStorage:", error);
		return createDefaultState();
	}
};

const persistState = (tournamentId: string, state: TournamentSimulationState) => {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.setItem(getStorageKey(tournamentId), JSON.stringify(state));
	} catch (error) {
		console.warn("Failed to persist tournament simulation state to localStorage:", error);
	}
};

export const getTournamentSimulationStore = (tournamentId: string) => {
	let store = storeCache.get(tournamentId);

	if (!store) {
		store = new Store(loadPersistedState(tournamentId));
		storeCache.set(tournamentId, store);
	}

	return store;
};

export const tournamentSimulationActions = {
	replaceMatchOverrides: (
		tournamentId: string,
		matchOverrides: TournamentSimulationState["matchOverrides"]
	) => {
		const store = getTournamentSimulationStore(tournamentId);
		const nextState: TournamentSimulationState = {
			version: CURRENT_VERSION,
			updatedAt: new Date().toISOString(),
			matchOverrides,
		};

		store.setState(() => nextState);
		persistState(tournamentId, nextState);
	},

	reset: (tournamentId: string) => {
		const store = getTournamentSimulationStore(tournamentId);
		const nextState = createDefaultState();

		store.setState(() => nextState);

		if (typeof window === "undefined") {
			return;
		}

		try {
			localStorage.removeItem(getStorageKey(tournamentId));
		} catch (error) {
			console.warn("Failed to reset tournament simulation state from localStorage:", error);
		}
	},
};
