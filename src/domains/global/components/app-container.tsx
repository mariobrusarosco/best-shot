import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { APP_MODE } from "../utils";

const AppContainer = () => {
	return (
		<Box
			data-ui="app-container"
			component="main"
			sx={{
				bgcolor: "black.700",
				// flexGrow: 1,
				// width: 1,
				// height: 1,
			}}
		>
			<Outlet />
			{APP_MODE === "local-dev" && (
				<TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
			)}
		</Box>
	);
};

export { AppContainer };
