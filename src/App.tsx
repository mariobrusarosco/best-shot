import * as Sentry from "@sentry/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppQueryProvider } from "@/configuration/app-query";
import { AppError } from "@/domains/global/components/error";
import { theme } from "@/domains/ui-system/theme";
import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIdentifier";
import { AppRouter } from "./app-router";
import { AppConfiguration } from "./configuration";
import { Authentication } from "./domains/authentication";
import { GlobalCSS } from "./theming/global-styles";
import "./theming/load-configuration";

const { AuthProvider } = Authentication;

AppConfiguration.init();

function App() {
	return (
		<Sentry.ErrorBoundary fallback={AppError} showDialog>
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
		</Sentry.ErrorBoundary>
	);
}

export default App;
