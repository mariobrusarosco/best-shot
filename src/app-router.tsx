import { createRouter, RouterProvider } from "@tanstack/react-router";
import { queryClient } from "@/configuration/app-query";
import { AppError } from "@/domains/global/components/error";
import { AppNotFound } from "@/domains/global/components/not-found";
import type { RouterContext } from "@/routes/__root";
import { routeTree } from "@/routeTree.gen";
import { Authentication } from "./domains/authentication";

// Type-safety registration
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: { isAuthenticated: false, isLoadingAuth: true },
	} as RouterContext,
	defaultErrorComponent: AppError,
	defaultNotFoundComponent: AppNotFound,
});

const Router = () => {
	return (
		<RouterProvider
			router={router}
			context={{
				queryClient,
			}}
		/>
	);
};

const AppRouter = () => {
	return <Router />;
};

export { AppRouter };
