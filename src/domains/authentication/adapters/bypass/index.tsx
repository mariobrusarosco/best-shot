import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { IAuthHook } from "..";

const ByPassAuthContext = createContext<IAuthHook | undefined>(undefined);

const memberid =
	localStorage.getItem("local-member-id") ??
	import.meta.env.VITE_MOCKED_MEMBER_ID;

export const ByPassAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, setState] = useState<IAuthHook>({
		isAuthenticated: false,
		authId: undefined,
		isLoadingAuth: true,
		logout: () => new Promise(() => {}),
		login: () => new Promise(() => {}),
		signup: () => new Promise(() => {}),
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
	const response = await api.post("whoami", { publicId });

	return response.data;
};

export const useByPassAuth = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error("useByPassAuth must be used within a ByPassAuthProvider");

	return context;
};
