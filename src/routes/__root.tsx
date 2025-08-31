import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AppDevTools } from "@/configuration/app-dev-tools";
import type { IAuthHook } from "@/domains/authentication/adapters/typing";
import { AppNotFound } from "@/domains/global/components/not-found";
import { FloatingActionButton } from "@/domains/ui-system/components/floating-action-button";

export interface RouterContext {
	queryClient: QueryClient;
	auth: IAuthHook;
}

const RootComponent = () => {
	return (
		<>
			<Outlet />
			<FloatingActionButton />
			<AppDevTools />
		</>
	);
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: AppNotFound,
});
