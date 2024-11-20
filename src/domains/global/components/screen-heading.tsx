import { UIHelper } from "@/theming/theme";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ComponentProps, forwardRef } from "react";

type SurfaceProps = ComponentProps<typeof Surface>;

interface Props extends SurfaceProps {
	children?: React.ReactNode;
	title?: string;
	subtitle?: string;
	tagText?: string;
}

const { startsOn, whileIs } = UIHelper.media;

export const ScreenHeading = forwardRef<HTMLDivElement, Props>((props) => {
	const { children, title, subtitle, ...rest } = props;
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h3";

	return (
		<Surface {...rest}>
			<Box>
				<Typography variant={titleVariant}>{title}</Typography>
				{subtitle ? <Typography variant="h6">{title}</Typography> : null}
			</Box>

			{children ? <Box>{children}</Box> : null}
		</Surface>
	);
});

ScreenHeading.displayName = "ScreenHeading";

const Surface = styled("div")(({ theme }) => {
	return {
		display: "flex",
		borderRadius: 24,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		color: theme.palette.neutral[100],

		[whileIs("mobile")]: {
			flexDirection: "column",
			padding: theme.spacing(11, 2, 6, 2),
		},

		[startsOn("tablet")]: {
			position: "relative",
			gap: theme.spacing(6),
			padding: theme.spacing(10, 5),
		},
	};
});
