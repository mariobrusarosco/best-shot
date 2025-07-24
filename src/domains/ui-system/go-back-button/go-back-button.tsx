import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { UIHelper } from "@/theming/theme";
import { styled, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

export const GoBackButton = ({ backTo }: { backTo: string }) => {
	const navigate = useNavigate();
	const handleBack = () => {
		navigate({
			to: backTo,
		});
	};
	return (
		<StyledButton onClick={handleBack}>
			<AppIcon name="ChevronLeft" size="extra-small" />
			<Typography variant="tag" color="neutral.100" textTransform="uppercase">
				back
			</Typography>
		</StyledButton>
	);
};

const StyledButton = styled(AppButton)(({ theme }) => ({
	position: "fixed",
	top: 30,
	right: 15,
	display: "flex",
	placeItems: "center",
	color: theme.palette.teal[500],
	gap: theme.spacing(0.5),
	zIndex: theme.zIndex.appBar,

	[UIHelper.startsOn("tablet")]: {
		top: theme.spacing(5),
		right: theme.spacing(4),
		position: "absolute",
	},
}));
