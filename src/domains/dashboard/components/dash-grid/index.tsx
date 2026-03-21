import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { UIHelper } from "@/domains/ui-system/theme";

export const DashGrid = styled(Box)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	display: "grid",
	gap: theme.spacing(2),
	gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
	gridAutoRows: "auto",

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(3),
		gridTemplateColumns: "repeat(2, minmax(100px, 320px))",
	},
}));
