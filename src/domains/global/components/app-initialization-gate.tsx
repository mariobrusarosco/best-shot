import { Authentication } from "@/domains/authentication";
import { AppLoader } from "./app-loader";

const { useAppAuth } = Authentication;

interface AppInitializationGateProps {
	children: React.ReactNode;
}

export const AppInitializationGate = ({ children }: AppInitializationGateProps) => {
	const auth = useAppAuth();

	if (auth.isLoadingAuth) {
		return <AppLoader />;
	}

	return <>{children}</>;
};

