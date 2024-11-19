import "./theming/load-configuration";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theming/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppRouter } from "./app-router";
import { AuthProvider } from "@/domains/authentication/context";
import { GlobalCSS } from "./theming/global-styles";

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
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<GlobalCSS />
					<AppRouter />
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
