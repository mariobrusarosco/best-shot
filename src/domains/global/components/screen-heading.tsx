import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import {
	Surface,
	SurfaceProps,
} from "@/domains/ui-system/components/surface/surface";
import { GoBackButton } from "@/domains/ui-system/go-back-button/go-back-button";
import { UIHelper } from "@/theming/theme";
import { styled, Typography, useMediaQuery } from "@mui/material";

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

			{title ? (
				<TextBox data-ui="text-box">
					<Typography
						data-ui="title"
						variant={titleVariant}
						textTransform="lowercase"
					>
						{title}
					</Typography>

					{subtitle ? (
						<Typography
							data-ui="subtitle"
							variant={subtitleVariant}
							color="teal.500"
							minHeight="18px"
						>
							{subtitle}
						</Typography>
					) : null}
				</TextBox>
			) : null}

			{children ? children : null}
		</Wrapper>
	);
};

export const Wrapper = styled(Surface)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	backgroundColor: theme.palette.black[800],
	borderBottomLeftRadius: theme.spacing(3),
	borderBottomRightRadius: theme.spacing(3),
	gap: theme.spacing(2),
	position: "relative",

	[UIHelper.whileIs("mobile")]: {
		height: "var(--screeh-heading-height-mobile)",
		paddingBottom: theme.spacing(4),
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	[UIHelper.startsOn("tablet")]: {
		height: "var(--screeh-heading-height-tablet)",
		padding: theme.spacing(4),
	},
	[UIHelper.startsOn("desktop")]: {},
}));

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
		...shimmerEffect(),
	}),
);
