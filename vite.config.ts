import path from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import {
	SENTRY_ENABLED_ENVIRONMENTS,
	type SentryEnvironment,
} from "./src/configuration/monitoring/constants";

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
		// Enable Sentry for demo, staging, and production builds
		SENTRY_ENABLED_ENVIRONMENTS.includes(mode as SentryEnvironment) &&
			sentryVitePlugin({
				org: process.env.SENTRY_ORG || "mario-79",
				project: process.env.SENTRY_PROJECT || "best-shot-demo",
				authToken: process.env.SENTRY_AUTH_TOKEN,
				telemetry: false,
				sourcemaps: {
					assets: "./dist/**",
					// CRITICAL: Delete source maps after upload to prevent them from being deployed
					filesToDeleteAfterUpload: ["./dist/**/*.map"],
				},
			}),
	].filter(Boolean),

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
		minify: SENTRY_ENABLED_ENVIRONMENTS.includes(mode as SentryEnvironment) ? "esbuild" : false,
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
