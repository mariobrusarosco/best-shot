import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

const ByPassAuthContext = createContext({});

export const ByPassAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const value = {
		isAuthenticated,
	};

	const { mutate } = useMutation({
		mutationFn: authenticatedLocalMember,
		onSuccess: () => setIsAuthenticated(true),
	});

	useEffect(() => {
		mutate(import.meta.env.VITE_MOCKED_MEMBER_ID);
	}, []);

	return (
		<ByPassAuthContext.Provider value={value}>
			{children}
		</ByPassAuthContext.Provider>
	);
};

export const authenticatedLocalMember = async (memberId: any) => {
	const response = await api.post("whoami", { memberId });

	return response.data;
};

export const useReactContextAdapter = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error(
			"useReactContextAdapter must be used within a ByPassAuthProvider",
		);

	return context;
};
