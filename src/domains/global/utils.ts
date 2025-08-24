import type { APP_MODES } from "@/domains/global/typing";

export const APP_MODE = import.meta.env.MODE as APP_MODES;

export const toNumberOrNull = (val: string | null | undefined) => {
	if (val === "" || val === null || undefined) return null;

	return Number(val);
};

export const updateSearchParams = (prev: Record<string, any>, key: string, value: any) => ({
	...prev,
	[key]: value,
});
