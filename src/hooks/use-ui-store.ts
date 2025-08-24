import { useStore } from "@tanstack/react-store";
import { uiActions, uiStore } from "@/stores/ui-store";

/**
 * Hook to access the UI store state and actions
 */
export const useUIStore = () => {
	const state = useStore(uiStore);
	return {
		state,
		actions: uiActions,
	};
};

/**
 * Hook to access only the FAB state and actions
 */
export const useFAB = () => {
	const state = useStore(uiStore, (state) => state.fab);
	return {
		fab: state,
		setPosition: uiActions.setFabPosition,
		setDragging: uiActions.setFabDragging,
		setVisibility: uiActions.setFabVisibility,
	};
};
