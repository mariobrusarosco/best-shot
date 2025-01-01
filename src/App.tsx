import { AppQueryProvider } from "@/configuration/app-query";
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
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<GlobalCSS />
					<AppRouter />
				</ThemeProvider>
			</AppQueryProvider>
		</>
	);
}

export default App;
