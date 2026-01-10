import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api";
import type { IAuthHook } from "@/domains/authentication/adapters/typing";
import { useMember } from "@/domains/member/hooks/use-member";

const ByPassAuthContext = createContext<IAuthHook | undefined>(undefined);

const memberid =
	localStorage.getItem("local-member-id") ?? import.meta.env.VITE_MOCKED_MEMBER_PUBLIC_ID;

export const Provider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setisAuthenticated] = useState(false);
	useMember({ fetchOnMount: isAuthenticated });

	const appLogout = async () => {
		try {
			await api.delete("whoami");
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	const appLogin = () => {
		try {
			alert("[DEMO MESSAGE] You're now logged in!");
			return Promise.resolve();
		} catch (error) {
			alert(error);
			return Promise.reject(error);
		}
	};

	const appSignup = () => {
		try {
			alert("[DEMO MESSAGE] You're now signed up!");
			return Promise.resolve();
		} catch (error) {
			alert(error);
			return Promise.reject(error);
		}
	};
	const [state, setState] = useState<IAuthHook>({
		isAuthenticated,
		authId: undefined,
		isLoadingAuth: true,
		logout: appLogout,
		login: appLogin,
		signup: appSignup,
	});
	// Update state when functions change (though they are stable here)
	// We need to keep state in sync with isAuthenticated
	useEffect(() => {
		setState((prev) => ({
			...prev,
			isAuthenticated,
			// only update if changed to avoid loop, but here logic is simple
		}));
	}, [isAuthenticated]);

	const { mutate } = useMutation({
		mutationFn: authenticatedLocalMember,
		onSuccess: () => {
			setState((prev) => ({
				...prev,
				authId: memberid as string,
				isAuthenticated: true,
				isLoadingAuth: false,
			}));
		},
		onSettled: () => setisAuthenticated(true),
	});

	useEffect(() => {
		mutate(memberid);
	}, [mutate]);

	return <ByPassAuthContext.Provider value={state}>{children}</ByPassAuthContext.Provider>;
};

export const authenticatedLocalMember = async (publicId: unknown) => {
	const response = await api.post(
		"auth",
		{ publicId },
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);

	return response.data;
};

export const hook = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error("useByPassAuth must be used within a ByPassAuthProvider");

	return context;
};

export default { hook, Provider };
