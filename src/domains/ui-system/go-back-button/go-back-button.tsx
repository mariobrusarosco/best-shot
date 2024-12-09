import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import Typography from "@mui/material/Typography/Typography";
import { useRouter } from "@tanstack/react-router";

export const GoBackButton = () => {
	const router = useRouter();

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
			onClick={router.history.back}
		>
			<AppIcon name="ChevronLeft" size="extra-small" />
			<Typography variant="tag" color="neutral.100" textTransform="uppercase">
				back
			</Typography>
		</AppButton>
	);
};
