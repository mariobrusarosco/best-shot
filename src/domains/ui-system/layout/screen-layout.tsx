import { ReactNode } from "react";
import { Container } from "@mui/system";

export const ScreenLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Container data-ui="screen" maxWidth="desktop">
			{children}
		</Container>
	);
};
