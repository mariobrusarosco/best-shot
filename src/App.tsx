import "./App.css";
import "./theming/load-configuration";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ComponentsDemo } from "./domains/ui-system/components-demo";
import { theme } from "./theming/theme";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppRouter } from "./app-router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			retry: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			console.error("Error happened: ", error);
		},
	}),
});

function App() {
	console.log("env: ", import.meta.env);

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ComponentsDemo />
					<AppRouter />
				</ThemeProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
