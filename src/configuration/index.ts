import { Monitoring } from "@/configuration/monitoring";

export const AppConfiguration = {
	init: () => {
		Monitoring.init();
	},
};
