import "./App.css";
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
import { AuthenticationAdapter } from "./domains/authentication/utils";

const mode = import.meta.env.MODE as
	| "demo"
	| "localhost"
	| "staging"
	| "production";

const AuthProvider = AuthenticationAdapter[mode].Provider;

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
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<AppRouter />
				</ThemeProvider>
			</QueryClientProvider>
		</AuthProvider>
	);
}

export default App;
