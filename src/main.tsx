import React from "react";
import ReactDOM from "react-dom/client";
import { AppSettings } from "settings";
import App from "./App.tsx";

console.log("ENV", import.meta.env);

AppSettings.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
