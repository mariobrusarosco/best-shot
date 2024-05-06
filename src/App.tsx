import "./App.css";
import "./theming/load-configuration";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ComponentsDemo } from "./domains/ui-system/components-demo";
import { theme } from "./theming/theme";

function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<h1>Best Shot</h1>
				{/* <ThemingSetup /> */}
				<ComponentsDemo />
			</ThemeProvider>
		</>
	);
}

export default App;
