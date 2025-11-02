import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppQueryProvider } from "@/configuration/app-query";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";
import { theme } from "@/domains/ui-system/theme";
import { Authentication } from "./domains/authentication";
import { AppInitializationGate } from "@/domains/global/components/app-initialization-gate";

const { AuthProvider } = Authentication;

AppConfiguration.init();

function App() {
	return (
		<AppQueryProvider>
			<ThemeProvider theme={theme}>
			<CssBaseline />
			<GlobalCSS />
			<AuthProvider>
				<AppInitializationGate>
					<AppRouter />
				</AppInitializationGate>
			</AuthProvider>
			</ThemeProvider>
		</AppQueryProvider>
	);
}

export default App;
