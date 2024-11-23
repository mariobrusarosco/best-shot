import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { IAuthHook } from "..";

const ByPassAuthContext = createContext<IAuthHook | undefined>(undefined);

export const ByPassAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, setState] = useState<IAuthHook>({
		isAuthenticated: false,
		authId: undefined,
		isLoadingAuth: false,
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

export const authenticatedLocalMember2 = async ({ queryKey }: any) => {
	const [, { authId }] = queryKey;
	const response = await api.get("whoami/" + authId);

	return response.data;
};

export const useByPassAuth = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error("useByPassAuth must be used within a ByPassAuthProvider");

	return context;
};
