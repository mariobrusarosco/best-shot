import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const DISCLAIMER_HEIGHT = 40;

const DisclaimerContainer = styled(Box)(({ theme }) => ({
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	height: DISCLAIMER_HEIGHT,
	backgroundColor: "#FFE4CC", // Light orange
	color: "#8B4000", // Dark orange text for contrast
	padding: theme.spacing(1),
	textAlign: "center",
	zIndex: theme.zIndex.appBar + 1,
	boxShadow: theme.shadows[2],
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

export const BetaDisclaimer = () => {
	return (
		<DisclaimerContainer>
			<Typography variant="paragraph" fontWeight={500}>
				This project is in Beta. Designs are not final
			</Typography>
		</DisclaimerContainer>
	);
};
