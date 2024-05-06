import "./App.css";
import "./theming/load-configuration";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemingSetup } from "./theming-setup";

function App() {
	return (
		<>
			<CssBaseline />
			<h1>Best Shot</h1>
			<ThemingSetup />
		</>
	);
}

export default App;
