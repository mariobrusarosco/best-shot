import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { ZodSchema } from "zod";
import { ErrorHandling } from "@/domains/error-handling";
import { validateApiResponse } from "./validation";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BEST_SHOT_API,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Use our centralized error handling utility
		ErrorHandling.logError({
			source: "API REQUEST",
			message: error.message,
			code: error.code,
			details: error.response?.data,
		});

		// Optionally, you can transform the error before returning it
		return Promise.reject(error);
	}
);

// Type-safe API request functions with Zod validation
export async function apiGet<T>(
	url: string,
	schema: ZodSchema<T>,
	config?: AxiosRequestConfig
): Promise<T> {
	const response: AxiosResponse = await api.get(url, config);
	return validateApiResponse(response.data, schema, url);
}

export async function apiPost<T, D = unknown>(
	url: string,
	data: D,
	schema: ZodSchema<T>,
	config?: AxiosRequestConfig
): Promise<T> {
	const response: AxiosResponse = await api.post(url, data, config);
	return validateApiResponse(response.data, schema, url);
}

export async function apiPut<T, D = unknown>(
	url: string,
	data: D,
	schema: ZodSchema<T>,
	config?: AxiosRequestConfig
): Promise<T> {
	const response: AxiosResponse = await api.put(url, data, config);
	return validateApiResponse(response.data, schema, url);
}

export async function apiPatch<T, D = unknown>(
	url: string,
	data: D,
	schema: ZodSchema<T>,
	config?: AxiosRequestConfig
): Promise<T> {
	const response: AxiosResponse = await api.patch(url, data, config);
	return validateApiResponse(response.data, schema, url);
}

export async function apiDelete<T>(
	url: string,
	schema: ZodSchema<T>,
	config?: AxiosRequestConfig
): Promise<T> {
	const response: AxiosResponse = await api.delete(url, config);
	return validateApiResponse(response.data, schema, url);
}

export const API = {
	get: apiGet,
	post: apiPost,
	put: apiPut,
	patch: apiPatch,
	delete: apiDelete,
};
