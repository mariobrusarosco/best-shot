import axios from "axios";
import { ErrorHandling } from "@/domains/error-handling";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BEST_SHOT_API,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.response.use(
	response => response,
	error => {
		// Use our centralized error handling utility
		ErrorHandling.logError({
			source: 'API REQUEST',
			message: error.message,
			code: error.code,
			details: error.response?.data,
		});
		
		// Optionally, you can transform the error before returning it
		return Promise.reject(error);
	}
);

