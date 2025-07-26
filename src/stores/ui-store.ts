import { Store } from "@tanstack/store";

export interface UIState {
	fab: {
		position: { x: number; y: number };
		isDragging: boolean;
		isVisible: boolean;
	};
	sidebar: {
		isCollapsed: boolean;
	};
	theme: {
		mode: "light" | "dark";
	};
}

const STORAGE_KEY = "best-shot-ui-state";

// Default state
const defaultState: UIState = {
	fab: {
		position: { x: 20, y: 100 }, // Default position (20px from left, 100px from top)
		isDragging: false,
		isVisible: true,
	},
	sidebar: {
		isCollapsed: false,
	},
	theme: {
		mode: "dark",
	},
};

// Load persisted state from localStorage
const loadPersistedState = (): UIState => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Merge with defaults to handle new properties
			return {
				...defaultState,
				...parsed,
				fab: {
					...defaultState.fab,
					...parsed.fab,
				},
				sidebar: {
					...defaultState.sidebar,
					...parsed.sidebar,
				},
				theme: {
					...defaultState.theme,
					...parsed.theme,
				},
			};
		}
	} catch (error) {
		console.warn("Failed to load UI state from localStorage:", error);
	}
	return defaultState;
};

// Create the store
export const uiStore = new Store(loadPersistedState());

// Persist state to localStorage (called manually for performance)
const persistState = () => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(uiStore.state));
	} catch (error) {
		console.warn("Failed to persist UI state to localStorage:", error);
	}
};

// Action creators for better type safety and reusability
export const uiActions = {
	// FAB actions
	setFabPosition: (position: { x: number; y: number }, shouldPersist = false) => {
		uiStore.setState((state) => ({
			...state,
			fab: {
				...state.fab,
				position,
			},
		}));
		
		// Only persist to localStorage when explicitly requested (e.g., on drag end)
		if (shouldPersist) {
			persistState();
		}
	},

	setFabDragging: (isDragging: boolean) => {
		uiStore.setState((state) => ({
			...state,
			fab: {
				...state.fab,
				isDragging,
			},
		}));
		
		// Don't persist dragging state - it's temporary UI state
	},

	setFabVisibility: (isVisible: boolean) => {
		uiStore.setState((state) => ({
			...state,
			fab: {
				...state.fab,
				isVisible,
			},
		}));
		
		// Persist visibility changes immediately
		persistState();
	},

	// Sidebar actions
	toggleSidebar: () => {
		uiStore.setState((state) => ({
			...state,
			sidebar: {
				...state.sidebar,
				isCollapsed: !state.sidebar.isCollapsed,
			},
		}));
		
		// Persist sidebar state immediately
		persistState();
	},

	// Theme actions
	setTheme: (mode: "light" | "dark") => {
		uiStore.setState((state) => ({
			...state,
			theme: {
				...state.theme,
				mode,
			},
		}));
		
		// Persist theme changes immediately
		persistState();
	},
};