import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		root: __dirname,
		setupFiles: ["./vitest.setup.ts"],
		css: false,
		isolate: false,
	},
});
