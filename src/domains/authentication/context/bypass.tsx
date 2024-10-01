import { createContext, useContext } from "react";

const ByPassAuthContext = createContext({});

export const ByPassAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const value = {
		isAuthenticated: true,
	};

	return (
		<ByPassAuthContext.Provider value={value}>
			{children}
		</ByPassAuthContext.Provider>
	);
};

export const useReactContextAdapter = () => {
	const context = useContext(ByPassAuthContext);

	if (context === undefined)
		throw new Error(
			"useReactContextAdapter must be used within a ByPassAuthProvider",
		);

	return context;
};
