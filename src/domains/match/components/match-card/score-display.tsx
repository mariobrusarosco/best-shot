import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";

export const ScoreDisplay = ({ value }: { value: string | null }) => {
	const content = value ?? "-";

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Typography variant="tag">score</Typography>
			<Pill bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{content}</Typography>
			</Pill>
		</Box>
	);
};
