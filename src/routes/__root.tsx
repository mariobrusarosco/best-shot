import { useAuth0 } from "@auth0/auth0-react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppContainer } from "../domains/global/components/app-container";

export interface RouterContext {
	auth: ReturnType<typeof useAuth0> | undefined | { isAuthenticated: boolean };
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: AppContainer,
});
