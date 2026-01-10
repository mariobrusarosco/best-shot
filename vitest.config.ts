import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		root: __dirname,
		setupFiles: ["./vitest.setup.ts"],
		css: false,
		exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "e2e/**", "tests-examples/**"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			settings: path.resolve(__dirname, "./settings"),
		},
	},
});
