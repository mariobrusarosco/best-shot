import { Box, styled } from "@mui/material";

// TODO Double-check if this layout is still necessary

// export const ScreenLayout = ({ children }: { children: ReactNode }) => {
// 	return (
// 		<Container data-ui="screen-layout" maxWidth="desktop">
// 			{children}
// 		</Container>
// 	);
// };

export const ScreenLayout = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		width: "100vw",
		height: "100vh",
	}),
);
