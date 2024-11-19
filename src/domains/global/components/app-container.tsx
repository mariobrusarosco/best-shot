import { Outlet } from "@tanstack/react-router";
import { Menu } from "./menu";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Box } from "@mui/system";

const AppContainer = () => {
	return (
		<Box
			data-ui="app-container"
			sx={{
				display: "flex",
				bgcolor: "black.700",
				minHeight: "100dvh",
			}}
		>
			<Menu />
			<Box data-ui="main-area" component="main" sx={{ flex: 1 }}>
				<Outlet />
			</Box>
			<TanStackRouterDevtools position="top-left" initialIsOpen={false} />
		</Box>
	);
};

export { AppContainer };
