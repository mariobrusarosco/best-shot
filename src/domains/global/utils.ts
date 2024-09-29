const isDemo = () => import.meta.env.MODE === "demo";
const isLocal = () => import.meta.env.MODE === "local";
const isStaging = () => import.meta.env.MODE === "staging";
const isProduction = () => import.meta.env.MODE === "production";

const shouldDisplayDevTools = isLocal();

export const Utils = {
	environments: {
		isDemo,
		isLocal,
		isProduction,
		isStaging,
		shouldDisplayDevTools,
	},
};
