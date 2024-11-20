import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";

export type SurfaceProps = ComponentProps<typeof Surface>;

const { startsOn, whileIs } = UIHelper.media;

export const Surface = styled("div")(({ theme }) => {
	return {
		// display: "flex",
		// borderRadius: 24,
		// borderTopLeftRadius: 0,
		// borderTopRightRadius: 0,
		color: theme.palette.neutral[100],

		[whileIs("mobile")]: {
			// flexDirection: "column",
			// padding: theme.spacing(11, 2, 6, 2),
		},

		[startsOn("tablet")]: {
			// position: "relative",
			// gap: theme.spacing(6),
			// padding: theme.spacing(10, 5),
		},
	};
});
