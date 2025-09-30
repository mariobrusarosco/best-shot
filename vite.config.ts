import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => ({
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
		minify: mode === "production" ? "esbuild" : false,
	},

	esbuild: {
		// Keep names for better debugging in development
		keepNames: mode !== "production",
	},

	define: {
		// Ensure we have proper source maps in development
		__DEV__: mode !== "production",
	},
}));
