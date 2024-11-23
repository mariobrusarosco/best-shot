import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppContainer } from "../domains/global/components/app-container";

export interface RouterContext extends ReturnType<typeof useAppAuth> {}
// export const Route = createRootRouteWithContext<RouterContext>()({

export const Route = createRootRouteWithContext<RouterContext>()({
	component: AppContainer,
});
