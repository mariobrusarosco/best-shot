import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { APP_MODE } from "@/domains/global/utils";
import { Box } from "@mui/system";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export interface RouterContext extends ReturnType<typeof useAppAuth> {}

const AppContainer = () => {
	return (
		<Box
			data-ui="app-container"
			component="main"
			sx={{
				bgcolor: "black.700",
			}}
		>
			<Outlet />
			{APP_MODE === "local-dev" && (
				<TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
			)}
		</Box>
	);
};

export const Route = createRootRouteWithContext()({
	component: AppContainer,
});
