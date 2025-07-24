import { Typography } from "@mui/material";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme } from "@/theming/theme";
import { MenuButton } from "./menu-button";
import { LinkList, MenuLink, MenuLogo, Wrapper } from "./styles";

export const Menu = () => {
	const isOpen = false;

	return (
		<Wrapper as="menu">
			<MenuLogo to="/">
				<BestShotIcon fill={theme.palette.neutral[100]} />
				<Typography
					textAlign="center"
					color={theme.palette.neutral[100]}
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
