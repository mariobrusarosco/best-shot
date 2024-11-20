import { styled } from "@mui/material/styles";
import { ComponentProps } from "react";

export type SurfaceProps = ComponentProps<typeof Surface>;

export const Surface = styled("div")(({ theme }) => {
	return {
		color: theme.palette.neutral[100],
	};
});
