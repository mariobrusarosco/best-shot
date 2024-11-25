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

	const titleVariant = isDesktopScreen ? "h1" : "h2";

	return (
		<Surface
			sx={{
				position: "relative",
				pt: 10,
				pb: 6,
				px: [3, 6],
				bgcolor: "black.800",
				borderBottomLeftRadius: "24px",
				borderBottomRightRadius: "24px",
				minHeight: 220,
			}}
		>
			{withBackButton ? <GoBackButton /> : null}
			<Box>
				<Typography variant={titleVariant}>{title}</Typography>
				{subtitle ? (
					<Typography variant="label" color="teal.500">
						{subtitle}
					</Typography>
				) : null}
			</Box>

			{children ? <Box>{children}</Box> : null}
		</Surface>
	);
};
