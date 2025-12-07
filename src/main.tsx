import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// @ts-expect-error
window.APP_ENV = import.meta.env;

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
