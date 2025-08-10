import { styled, Typography, useMediaQuery } from "@mui/material";
import { appShimmerEffect } from "@/domains/ui-system/components/app-skeleton";
import { AppSurface, type AppSurfaceProps } from "@/domains/ui-system/components/app-surface";
import { GoBackButton } from "@/domains/global/components/go-back-button/go-back-button";
import { UIHelper } from "@/theming/theme";

interface Props extends AppSurfaceProps {
	children?: React.ReactNode;
	title?: string;
	subtitle?: string;
	tagText?: string;
	backTo?: string;
}

const { startsOn } = UIHelper;

export const ScreenHeading = (props: Props & WrapperProps) => {
	const { children, title, subtitle, backTo, ...wrapperProps } = props;
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h4";
	const subtitleVariant = isDesktopScreen ? "h6" : "paragraph";

	return (
		<Wrapper data-ui="screen-heading" {...wrapperProps}>
			{backTo ? <GoBackButton backTo={backTo} /> : null}

			{title ? (
				<TextBox data-ui="text-box">
					<Typography data-ui="title" variant={titleVariant} textTransform="lowercase">
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

interface WrapperProps extends AppSurfaceProps {
	dynamicHeight?: string | number;
}

export const Wrapper = styled(AppSurface)<WrapperProps>(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.spacing(1.5),
	gap: theme.spacing(2),
	position: "relative",
	height: "auto",

	[UIHelper.whileIs("mobile")]: {
		paddingBottom: theme.spacing(4),
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		margin: theme.spacing(1.5),
		minHeight: "150px",
	},
	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(4),
		minHeight: "200px",
	},
	[UIHelper.startsOn("desktop")]: {
		minHeight: "200px",
	},
}));

const TextBox = styled(AppSurface)(() => ({
	display: "flex",
	flexDirection: "column",

	[UIHelper.startsOn("tablet")]: {
		flex: 1,
	},
}));

export const ScreenHeadingSkeleton = styled(Wrapper)(({ theme, dynamicHeight }) => ({
	backgroundColor: theme.palette.black[800],
	borderBottomLeftRadius: theme.spacing(3),
	borderBottomRightRadius: theme.spacing(3),
	position: "relative",
	minHeight: dynamicHeight ?? "150px",

	...appShimmerEffect(),

	[UIHelper.startsOn("tablet")]: {
		minHeight: dynamicHeight ?? "200px",
	},

	[UIHelper.startsOn("desktop")]: {
		minHeight: dynamicHeight ?? "200px",
	},
}));
