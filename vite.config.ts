import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import checker from "vite-plugin-checker";

export default defineConfig({
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
