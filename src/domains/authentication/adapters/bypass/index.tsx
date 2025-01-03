import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { IAuthHook } from "../typing";

const ByPassAuthContext = createContext<IAuthHook | undefined>(undefined);

const memberid =
	localStorage.getItem("local-member-id") ??
	import.meta.env.VITE_MOCKED_MEMBER_ID;

export const Provider = ({ children }: { children: React.ReactNode }) => {
	const appLogout = async () => {
		try {
			await api.delete("whoami");
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	const appLogin = async () => {
		try {
			alert("[DEMO MESSAGE] You're now logged in!");
			return Promise.resolve();
		} catch (error) {
			alert(error);
			return Promise.reject(error);
		}
	};

	const appSignup = async () => {
		try {
			alert("[DEMO MESSAGE] You're now signed up!");
			return Promise.resolve();
		} catch (error) {
			alert(error);
			return Promise.reject(error);
		}
	};

	const [state, setState] = useState<IAuthHook>({
		isAuthenticated: false,
		authId: undefined,
		isLoadingAuth: true,
		logout: appLogout,
		login: appLogin,
		signup: appSignup,
	});

	const { mutate } = useMutation({
		mutationFn: authenticatedLocalMember,
	});

	useEffect(() => {
		mutate(memberid);
		setState((prev) => ({
			...prev,
			authId: memberid as string,
			isAuthenticated: true,
			isLoadingAuth: false,
		}));
	}, []);

	return (
		<ByPassAuthContext.Provider value={state}>
			{children}
		</ByPassAuthContext.Provider>
	);
};

export const authenticatedLocalMember = async (publicId: any) => {
	const response = await api.get("whoami", { params: { publicId } });

	return response.data;
};

export const hook = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error("useByPassAuth must be used within a ByPassAuthProvider");

	return context;
};

export default { hook, Provider };
