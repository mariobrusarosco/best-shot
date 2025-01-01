import { AppQueryProvider } from "@/configuration/app-query";
import { AuthProvider } from "@/domains/authentication/context";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouter } from "./app-router";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";
import { theme } from "./theming/theme";

function App() {
	return (
		<>
			<AppQueryProvider>
				<AuthProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalCSS />
						<AppRouter />
					</ThemeProvider>
				</AuthProvider>
			</AppQueryProvider>
		</>
	);
}

export default App;
