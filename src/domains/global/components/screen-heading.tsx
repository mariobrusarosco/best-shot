import { skeletonAnimation } from "@/domains/ui-system/components/skeleton/skeleton";
import {
	Surface,
	SurfaceProps,
} from "@/domains/ui-system/components/surface/surface";
import { GoBackButton } from "@/domains/ui-system/go-back-button/go-back-button";
import { UIHelper } from "@/theming/theme";
import { Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";

interface Props extends SurfaceProps {
	children?: React.ReactNode;
	title?: string;
	subtitle?: string;
	tagText?: string;
	backTo?: string;
}

const { startsOn } = UIHelper;

export const ScreenHeading = (props: Props) => {
	const { children, title, subtitle, backTo } = props;
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h4";
	const subtitleVariant = isDesktopScreen ? "paragraph" : "label";

	return (
		<Wrapper data-ui="screen-heading">
			{backTo ? <GoBackButton backTo={backTo} /> : null}

			<TextBox data-ui="text-box">
				<Typography
					data-ui="title"
					variant={titleVariant}
					textTransform="lowercase"
				>
					{title}
				</Typography>

				<Typography
					data-ui="subtitle"
					variant={subtitleVariant}
					color="teal.500"
					minHeight="18px"
				>
					{subtitle}
				</Typography>
			</TextBox>

			{children ? children : null}
		</Wrapper>
	);
};

const Wrapper = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		height: {
			all: "var(--screeh-heading-height-mobile)",
			tablet: "var(--screeh-heading-height-tablet)",
		},
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 2,
		px: {
			all: 2,
			tablet: 6,
		},
		pt: {
			all: 10,
			tablet: 8,
		},
		pb: {
			all: 6,
			tablet: 8,
		},
		bgcolor: "black.800",
		borderBottomLeftRadius: "24px",
		borderBottomRightRadius: "24px",
	}),
);

const TextBox = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flexDirection: "column",
		gap: {
			all: 0,
			tablet: 0,
		},
	}),
);

export const ScreenHeadingSkeleton = styled(Wrapper)(({ theme }) =>
	theme?.unstable_sx({
		...skeletonAnimation(),
	}),
);
