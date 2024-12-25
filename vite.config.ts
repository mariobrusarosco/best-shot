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
		react(),
		checker({
			typescript: true,
		}),
		// visualizer({
		// 	gzipSize: true,
		// 	brotliSize: true,
		// 	emitFile: true,
		// 	filename: "stats.html",
		// }),
		// sentryVitePlugin({
		// 	org: "mario-79",
		// 	project: "best-shot-demo",
		// 	authToken: process.env.SENTRY_AUTH_TOKEN,
		// }),
	],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			settings: path.resolve(__dirname, "./settings"),
		},
	},

	optimizeDeps: {
		exclude: ["@tabler/icons-react"],
		extensions: [".mjs"],
		esbuildOptions: {
			treeShaking: true,
		},
	},

	build: {
		sourcemap: true,
	},
});
