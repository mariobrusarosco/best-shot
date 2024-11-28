import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_BEST_SHOT_API,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
