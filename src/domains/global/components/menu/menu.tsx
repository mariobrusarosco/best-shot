import { Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "@tanstack/react-router";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { UIHelper } from "@/theming/theme";
import { MenuButton } from "./menu-button";

export const Menu = () => {
	const isOpen = false;

	return (
		<Wrapper as="menu">
			<MenuLogo to="/">
				<BestShotIcon fill="currentColor" />
				<Typography
					textAlign="center"
					color="neutral.100"
					variant="label"
					data-id="menu-logo"
				>
					best shot
				</Typography>
			</MenuLogo>
			<LinkList>
				<MenuLink to="/dashboard">
					<MenuButton iconName="LayoutDashboard" />
					{isOpen ? (
						<Typography color="black.400" variant="topic" textTransform="uppercase">
							dashboard
						</Typography>
					) : null}
				</MenuLink>
				<MenuLink to="/tournaments">
					<MenuButton iconName="Trophy" />
					{isOpen ? (
						<Typography color="black.400" variant="topic" textTransform="uppercase">
							tournaments
						</Typography>
					) : null}
				</MenuLink>
				<MenuLink to="/leagues">
					<MenuButton iconName="Users" />
					{isOpen ? (
						<Typography color="black.400" variant="topic" textTransform="uppercase">
							leagues
						</Typography>
					) : null}
				</MenuLink>
				<MenuLink to="/my-account">
					<MenuButton iconName="User" />
					{isOpen ? (
						<Typography color="black.400" variant="topic" textTransform="uppercase">
							my account
						</Typography>
					) : null}
				</MenuLink>
			</LinkList>
		</Wrapper>
	);
};

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Navigation menu wrapper
const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		backgroundColor: theme.palette.black[800],
	},
}));

// Menu logo link with branding
const MenuLogo = styled(Link)(({ theme }) => ({
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(10),
	display: "none",
	color: theme.palette.neutral[100], // Provide color for currentColor fill

	'& svg': {
		width: "40px",
	},
	
	[UIHelper.startsOn("tablet")]: {
		display: "grid",
		placeItems: "center",
		gap: theme.spacing(1),
	},
}));

// Navigation links container
const LinkList = styled(Box)(({ theme }) => ({
	display: "flex",
	borderTopRightRadius: "16px",
	borderTopLeftRadius: "16px",
	gap: theme.spacing(4),
	maxHeight: "100vh",
	backgroundColor: theme.palette.black[800],

	[UIHelper.whileIs("mobile")]: {
		justifyContent: "center",
		padding: theme.spacing(3, 2),
		width: "100vw",
		position: "fixed",
		bottom: 0,
		zIndex: theme.zIndex.appBar,
	},
	
	[UIHelper.startsOn("tablet")]: {
		width: "auto",
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "column",
		padding: theme.spacing(2),
		gap: theme.spacing(4),
	},
}));

// Individual menu link
const MenuLink = styled(Link)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	textDecoration: "none",

	'&:hover': {
		transform: 'scale(1.05)',
		transition: theme.transitions.create(['transform']),
	},
}));
