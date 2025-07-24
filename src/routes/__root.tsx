import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AppDevTools } from "@/configuration/app-dev-tools";
import { AppNotFound } from "@/domains/global/components/not-found";

export interface RouterContext {
	queryClient: QueryClient;
	auth: any;
}

const RootComponent = () => {
	return (
		<>
			<Outlet />
			<AppDevTools />
		</>
	);
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: AppNotFound,
});
