import { Box, styled } from "@mui/system";
import { Surface } from "../surface/surface";

const CardHeader = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
	})
);

const CardContainer = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "grid",
		height: "100%",
		overflow: "hidden",
		gridTemplateRows: "40px auto",
		alignContent: "space-between",
		gap: {
			all: 2,
			tablet: 3,
		},
	})
);

const Skeleton = () => {
	return (
		<CardContainer
			sx={{
				opacity: "0.4",
			}}
		></CardContainer>
	);
};

export const AppCard = {
	Container: CardContainer,
	Header: CardHeader,
	Skeleton,
};
