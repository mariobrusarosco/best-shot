import { ReactNode } from "react";
import { Container } from "@mui/system";

// TODO Double-check if this layout is still necessary

export const ScreenLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Container data-ui="screen-layout" maxWidth="desktop">
			{children}
		</Container>
	);
};
