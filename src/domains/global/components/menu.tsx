import { BestShotIcon } from "@/assets/best-shot-icon";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { ICONS } from "@/domains/ui-system/components/icon/mapper";
import { theme, UIHelper } from "@/theming/theme";
import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "@tanstack/react-router";

const { startsOn, whileIs } = UIHelper;

export const Menu = () => {
	const isOpen = false;

	return (
		<Wrapper as="menu">
			<Box
				width={50}
				pt={2}
				pb={10}
				sx={{ display: { all: "none", tablet: "block" } }}
			>
				<BestShotIcon fill={theme.palette.neutral[100]} />
			</Box>
			<HeaderLink to="/dashboard">
				<HeaderButton iconName="LayoutDashboard" />
				{isOpen ? (
					<Typography
						color="black.400"
						variant="topic"
						textTransform="uppercase"
					>
						dashboard
					</Typography>
				) : null}
			</HeaderLink>
			<HeaderLink to="/tournaments">
				<HeaderButton iconName="Trophy" />
				{isOpen ? (
					<Typography
						color="black.400"
						variant="topic"
						textTransform="uppercase"
					>
						tournaments
					</Typography>
				) : null}
			</HeaderLink>
			<HeaderLink to="/leagues">
				<HeaderButton iconName="Users" />
				{isOpen ? (
					<Typography
						color="black.400"
						variant="topic"
						textTransform="uppercase"
					>
						leagues
					</Typography>
				) : null}
			</HeaderLink>
			<HeaderLink to="/my-account">
				<HeaderButton iconName="User" />
				{isOpen ? (
					<Typography
						color="black.400"
						variant="topic"
						textTransform="uppercase"
					>
						my account
					</Typography>
				) : null}
			</HeaderLink>
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	borderTopRightRadius: "16px",
	borderTopLeftRadius: "16px",
	gap: theme.spacing(4),
	backgroundColor: theme.palette.black[800],
	maxHeight: "100vh",

	[whileIs("mobile")]: {
		justifyContent: "center",
		padding: theme.spacing(3, 2),
		width: "100vw",
		position: "fixed",
		bottom: 0,
		zIndex: theme.zIndex.appBar,
	},
	[startsOn("tablet")]: {
		width: "auto",
		justifyContent: "flex-start",

		flexDirection: "column",
		padding: theme.spacing(2),
		gap: "40px",
	},
}));

const HeaderLink = styled(Link)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
}));

const HeaderButton = ({ iconName }: { iconName: keyof typeof ICONS }) => {
	const theme = useTheme();

	return (
		<AppButton
			sx={{
				backgroundColor: theme.palette.teal[500],
				color: theme.palette.neutral[100],
				padding: theme.spacing(1),
				borderRadius: theme.shape.borderRadius,
				display: "inline-flex",
				minWidth: 24,
				minHeight: 24,

				".active &, &:hover": {
					color: theme.palette.teal[500],
					backgroundColor: theme.palette.neutral[100],
				},
			}}
		>
			<AppIcon name={iconName} size="small" stroke={2} width={20} height={20} />
		</AppButton>
	);
};
