import { styled } from "@mui/material/styles";
import type { ComponentProps } from "react";

export type AppSurfaceProps = ComponentProps<typeof AppSurface>;

export const AppSurface = styled("div")(({ theme }) => {
	return {
		color: theme.palette.neutral[100],
	};
});
