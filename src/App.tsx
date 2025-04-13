import { AppQueryProvider } from "@/configuration/app-query";
import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIdentifier";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";
import { theme } from "./theming/theme";
import { Authentication } from "./domains/authentication";

const { AuthProvider } = Authentication;

AppConfiguration.init();

function App() {
	return (
		<>
			<AppQueryProvider>
		<AuthProvider>

				<ThemeProvider theme={theme}>
					<CssBaseline />
						<GlobalCSS />
						<AppRouter />
						<LaunchDarklyUserIdentifier />
					</ThemeProvider>
				</AuthProvider>
			</AppQueryProvider>
		</>
	);
}

export default App;
