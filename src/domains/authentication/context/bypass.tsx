import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { IAuthHook } from "../adapters";

const ByPassAuthContext = createContext<IAuthHook | undefined>(undefined);

export const ByPassAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, setState] = useState<IAuthHook>({
		isAuthenticated: false,
		authId: undefined,
		isLoadingAuth: true,
	});

	const { mutate } = useMutation({
		mutationFn: authenticatedLocalMember,
	});

	useEffect(() => {
		mutate(import.meta.env.VITE_MOCKED_MEMBER_ID);
		setState({
			authId: import.meta.env.VITE_MOCKED_MEMBER_ID,
			isAuthenticated: true,
			isLoadingAuth: false,
		});
	}, []);

	return (
		<ByPassAuthContext.Provider value={state}>
			{children}
		</ByPassAuthContext.Provider>
	);
};

export const authenticatedLocalMember = async (memberId: any) => {
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const useAuthByPass = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error("useAuthByPass must be used within a ByPassAuthProvider");

	return context;
};
