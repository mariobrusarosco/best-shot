import { styled } from "@mui/system";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/domains/ui-system/theme";

const Card = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2),
	paddingLeft: theme.spacing(2.5),
	paddingRight: theme.spacing(2.5),
	borderRadius: theme.spacing(2),
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
	justifyContent: "space-between",

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(3),
		maxHeight: "160px",
	},
}));

export const CardSkeleton = styled(Card)(() => ({
	position: "relative",
	...shimmerEffect(),
}));

export const DashCard = {
	Component: Card,
	Skeleton: CardSkeleton,
};
