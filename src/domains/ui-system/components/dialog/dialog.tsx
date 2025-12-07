import {
	type DialogProps,
	IconButton,
	Dialog as MuiDialog,
	DialogActions as MuiDialogActions,
	DialogContent as MuiDialogContent,
	DialogTitle as MuiDialogTitle,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";

interface AppDialogProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	actions?: ReactNode;
	maxWidth?: DialogProps["maxWidth"];
	fullWidth?: boolean;
}

export const AppDialog = ({
	open,
	onClose,
	title,
	children,
	actions,
	maxWidth = "tablet",
	fullWidth = true,
}: AppDialogProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("tablet"));

	return (
		<StyledDialog
			open={open}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			fullScreen={isMobile}
			aria-labelledby="dialog-title"
		>
			{title && (
				<StyledDialogTitle id="dialog-title">
					{title}
					<CloseButton aria-label="close" onClick={onClose} size="small">
						<AppIcon name="X" size="small" />
					</CloseButton>
				</StyledDialogTitle>
			)}

			<StyledDialogContent>{children}</StyledDialogContent>

			{actions && <StyledDialogActions>{actions}</StyledDialogActions>}
		</StyledDialog>
	);
};

// ===== STYLED COMPONENTS =====

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
	"& .MuiDialog-paper": {
		backgroundColor: theme.palette.black[700],
		backgroundImage: "none",
		borderRadius: theme.spacing(1),

		[theme.breakpoints.down("tablet")]: {
			margin: 0,
			borderRadius: 0,
		},
	},

	"& .MuiBackdrop-root": {
		backgroundColor: "rgba(0, 0, 0, 0.75)",
	},
}));

const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
	color: theme.palette.neutral[100],
	padding: theme.spacing(3),
	paddingBottom: theme.spacing(2),
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	textTransform: "uppercase",
	fontSize: "1.25rem",
	fontWeight: 600,
}));

const StyledDialogContent = styled(MuiDialogContent)(({ theme }) => ({
	padding: theme.spacing(3),
	paddingTop: theme.spacing(2),
	color: theme.palette.neutral[100],
}));

const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
	padding: theme.spacing(3),
	paddingTop: theme.spacing(2),
	gap: theme.spacing(2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
	color: theme.palette.neutral[500],

	"&:hover": {
		color: theme.palette.neutral[100],
		backgroundColor: theme.palette.black[800],
	},
}));
