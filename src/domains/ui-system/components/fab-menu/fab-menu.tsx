import {
	Box,
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	type SxProps,
	styled,
	type Theme,
} from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { UIHelper } from "@/theming/theme";

export interface FABAction {
	id: string;
	label: string;
	icon: ReactNode;
	onClick: () => void;
}

interface FABMenuProps {
	/**
	 * Primary action - always visible
	 * If only one action, FAB acts as a button
	 * If multiple actions, FAB opens a menu
	 */
	actions: FABAction[];
	/**
	 * Position of the FAB
	 */
	position?: {
		bottom?: number | string;
		right?: number | string;
		top?: number | string;
		left?: number | string;
	};
	/**
	 * Additional styles
	 */
	sx?: SxProps<Theme>;
}

export const FABMenu = ({ actions, position, sx }: FABMenuProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
	const handleCloseMenu = () => setIsMenuOpen(false);

	const handleActionClick = (action: FABAction) => {
		action.onClick();
		handleCloseMenu();
	};

	return (
		<FABMenuContainer
			sx={{
				...position,
			}}
		>
			{/* Menu Panel */}
			{isMenuOpen && (
				<>
					<MenuBackdrop onClick={handleCloseMenu} />
					<MenuPanel elevation={6}>
						<List disablePadding>
							{actions.map((action) => (
								<ListItem key={action.id} disablePadding>
									<MenuListItemButton onClick={() => handleActionClick(action)}>
										<ListItemIcon>{action.icon}</ListItemIcon>
										<ListItemText primary={action.label} />
									</MenuListItemButton>
								</ListItem>
							))}
						</List>
					</MenuPanel>
				</>
			)}

			{/* FAB Button */}
			<StyledFab
				color="primary"
				aria-label="menu"
				onClick={handleToggleMenu}
				sx={{
					transform: isMenuOpen ? "rotate(45deg)" : "rotate(0deg)",
					...sx,
				}}
			>
				<AppIcon name="Plus" size="medium" />
			</StyledFab>
		</FABMenuContainer>
	);
};

// ===== STYLED COMPONENTS =====

const FABMenuContainer = styled(Box)(() => ({
	position: "fixed",
	zIndex: 1200,
}));

const StyledFab = styled(Fab)(({ theme }) => ({
	width: 56,
	height: 56,
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.neutral[100],
	boxShadow: theme.shadows[6],
	transition: theme.transitions.create(["transform", "background-color", "box-shadow"], {
		duration: theme.transitions.duration.short,
	}),

	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
		boxShadow: theme.shadows[8],
	},

	[UIHelper.whileIs("mobile")]: {
		width: 48,
		height: 48,
	},
}));

const MenuBackdrop = styled(Box)(() => ({
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	zIndex: -1,
}));

const MenuPanel = styled(Paper)(({ theme }) => ({
	position: "absolute",
	bottom: theme.spacing(8),
	right: 0,
	minWidth: 200,
	backgroundColor: theme.palette.black[700],
	borderRadius: theme.spacing(1),
	overflow: "hidden",

	[UIHelper.whileIs("mobile")]: {
		minWidth: 180,
		bottom: theme.spacing(7),
	},
}));

const MenuListItemButton = styled(ListItemButton)(({ theme }) => ({
	padding: theme.spacing(2),
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.black[800],
	},

	"& .MuiListItemIcon-root": {
		minWidth: 40,
		color: theme.palette.primary.main,
	},

	"& .MuiListItemText-primary": {
		fontSize: "0.9rem",
		fontWeight: 500,
	},
}));
