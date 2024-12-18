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
				top: { all: 22, tablet: 100 },
				right: { all: 15, tablet: 40 },
				color: "teal.500",
				display: "flex",
				placeItems: "center",
				gap: 0.5,
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
