import { Box } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const AppContainer = () => {
	return (
		<Box
			data-ui="app-container"
			component="main"
			sx={{
				bgcolor: "black.700",
				height: "100%",
			}}
		>
			<Outlet />
			<TanStackRouterDevtools position="top-left" initialIsOpen={false} />
		</Box>
	);
};

export { AppContainer };
