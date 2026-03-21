import { Box, styled } from "@mui/system";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/domains/ui-system/theme";

const CardHeader = styled(Box)(() => ({
	display: "flex",
	justifyContent: "space-between",
}));

const CardContainer = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2),
	borderRadius: theme.spacing(2),
	display: "grid",
	height: "100%",
	overflow: "hidden",
	gridTemplateRows: "40px auto",
	alignContent: "space-between",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(3),
	},
}));

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
