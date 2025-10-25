import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AppDevTools } from "@/configuration/app-dev-tools";
import type { IAuthHook } from "@/domains/authentication/adapters/typing";
import { BetaDisclaimer } from "@/domains/global/components/beta-disclaimer";
import { AppNotFound } from "@/domains/global/components/not-found";

export interface RouterContext {
	queryClient: QueryClient;
	auth: IAuthHook;
}

const RootComponent = () => {
	return (
		<>
			<BetaDisclaimer />
			<Outlet />
			<AppDevTools />
		</>
	);
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: AppNotFound,
});
