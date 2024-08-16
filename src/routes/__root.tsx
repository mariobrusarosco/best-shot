import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppContainer } from "../domains/global/components/app-container";
import { useAuth0 } from "@auth0/auth0-react";

export interface RouterContext {
	auth: ReturnType<typeof useAuth0> | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => <AppContainer />,
});
