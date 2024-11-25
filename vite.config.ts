import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
	server: {
		host: true,
		cors: {
			origin: "*",
		},
	},
	plugins: [
		TanStackRouterVite(),
		,
		react(),
		checker({
			typescript: true,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
