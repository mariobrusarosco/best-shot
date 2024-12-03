import { APP_MODES } from "@/domains/global/typing";

export const APP_MODE = import.meta.env.MODE as APP_MODES;

export const toNumberOrNull = (val: string | null | undefined) => {
	if (val === "" || val === null || undefined) return null;

	return Number(val);
};
