import { AppQueryProvider } from "@/configuration/app-query";
import { LaunchDarklyProvider } from "@/configuration/launch-darkly-provider";
import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIdentifier";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";
import { theme } from "./theming/theme";

AppConfiguration.init();

function App() {
	return (
		<>
			<AppQueryProvider>
				<LaunchDarklyProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalCSS />
						<AppRouter />
						<LaunchDarklyUserIdentifier />
					</ThemeProvider>
				</LaunchDarklyProvider>
			</AppQueryProvider>
		</>
	);
}

export default App;
