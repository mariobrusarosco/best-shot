import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
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
		visualizer({
			gzipSize: true,
			brotliSize: true,
			emitFile: true,
			filename: "stats.html",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	optimizeDeps: {
		exclude: ["@tabler/icons-react"],
		extensions: [".mjs"],
		esbuildOptions: {
			treeShaking: true,
		},
	},
});
