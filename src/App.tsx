import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as Sentry from "@sentry/react";
import { AppQueryProvider } from "@/configuration/app-query";
import { AppError } from "@/domains/global/components/error";
import { theme } from "@/domains/ui-system/theme";
import "@/domains/ui-system/theme/fonts";
import { GlobalCSS } from "@/domains/ui-system/theme/global-styles";
import { AppRouter } from "./app-router";
// import LaunchDarklyUserIdentifier from "@/utils/LaunchDarklyUserIden
import { AppConfiguration } from "./configuration";
import { Authentication } from "./domains/authentication";
import { APP_MODE } from "./domains/global/utils";

AppConfiguration.init();

console.log({ APP_MODE, Authentication });

function App() {
	return (
		<Sentry.ErrorBoundary fallback={AppError} showDialog>
			<AppQueryProvider>
				<Authentication.Provider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalCSS />
						<AppRouter />
						{/* <LaunchDarklyUserIdentifier /> */}
						{/* <SentryUserIdentifier /> */}
					</ThemeProvider>
				</Authentication.Provider>
			</AppQueryProvider>
		</Sentry.ErrorBoundary>
	);
}

export default App;
