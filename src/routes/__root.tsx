import { createRootRoute } from "@tanstack/react-router";
import { AppContainer } from "../domains/global/components/app-container";

export const Route = createRootRoute({
	component: () => <AppContainer />,
});
