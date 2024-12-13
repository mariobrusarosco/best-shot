import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import Typography from "@mui/material/Typography/Typography";
import { useNavigate } from "@tanstack/react-router";

export const GoBackButton = ({ backTo }: { backTo: string }) => {
	const navigate = useNavigate();
	const handleBack = () => {
		navigate({
			to: backTo,
		});
	};
	return (
		<AppButton
			sx={{
				position: "absolute",
				top: 0,
				color: "teal.500",
				display: "flex",
				placeItems: "center",
				gap: 0.5,
				py: 4,
			}}
			onClick={handleBack}
		>
			<AppIcon name="ChevronLeft" size="extra-small" />
			<Typography variant="tag" color="neutral.100" textTransform="uppercase">
				back
			</Typography>
		</AppButton>
	);
};
