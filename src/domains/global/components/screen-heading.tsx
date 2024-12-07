import {
	Surface,
	SurfaceProps,
} from "@/domains/ui-system/components/surface/surface";
import { GoBackButton } from "@/domains/ui-system/go-back-button/go-back-button";
import { UIHelper } from "@/theming/theme";
import { Box, Typography, useMediaQuery } from "@mui/material";

interface Props extends SurfaceProps {
	children?: React.ReactNode;
	title?: string;
	subtitle?: string;
	tagText?: string;
	withBackButton?: boolean;
}

const { startsOn } = UIHelper.media;

export const ScreenHeading = (props: Props) => {
	const { children, title, subtitle, withBackButton } = props;
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h3";

	return (
		<Surface
			sx={{
				position: "relative",
				px: {
					all: 3,
					tablet: 2,
				},
				py: {
					all: 10,
					tablet: 4,
				},
				bgcolor: "black.800",
				borderBottomLeftRadius: "24px",
				borderBottomRightRadius: "24px",
				gridColumn: "1 / 4",
				display: {
					tablet: "flex",
				},
				minHeight: {
					all: 200,
					tablet: 100,
				},
			}}
		>
			{withBackButton ? <GoBackButton /> : null}

			{/* <Box data-ui="title-and-subtitle"> */}
			{title ? (
				<Typography
					data-ui="title"
					variant={titleVariant}
					textTransform="lowercase"
				>
					{title}
				</Typography>
			) : null}

			{subtitle ? (
				<Typography data-ui="subtitle" variant="label" color="teal.500">
					{subtitle}
				</Typography>
			) : null}
			{/* </Box> */}

			{children ? <Box data-ui="children">{children}</Box> : null}
		</Surface>
	);
};
