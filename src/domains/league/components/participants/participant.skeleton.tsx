import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box } from "@mui/system";
import { Card } from "./participant";

export const ParticipantSkeleton = () => {
	return (
		<Card>
			<Box display="grid">
				<Typography variant="label" textTransform="lowercase" color="black.300">
					...
				</Typography>
				<Typography variant="paragraph" textTransform="capitalize">
					...
				</Typography>
			</Box>
			<AppPill.Component bgcolor="black.800" minWidth={55} height={20}>
				<Typography variant="tag">...</Typography>
			</AppPill.Component>
		</Card>
	);
};
