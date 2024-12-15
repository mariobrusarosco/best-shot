import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";

export const ScoreDisplay = ({ value }: { value: number | null }) => {
	if (!value) return null;

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Typography textTransform="uppercase" variant="tag">
				score
			</Typography>
			<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{value}</Typography>
			</AppPill.Component>
		</Box>
	);
};
