import { GUESS_STATUS } from "@/domains/guess/typing";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";

export const GuessDisplay = ({ data }: { data?: any }) => {
	const content = data?.value ?? "-";
	const { color, bgColor } = getStylesByStatus(data?.status);

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Typography variant="tag" color={color}>
				guess
			</Typography>
			<Pill bgcolor={bgColor} minWidth={30} height={20}>
				<Typography variant="tag">{content}</Typography>
			</Pill>
		</Box>
	);
};

const getStylesByStatus = (status?: string) => {
	if (status === GUESS_STATUS.INCORRECT_GUESS)
		return {
			color: "red.400",
			bgColor: "red.400",
		};

	if (status === GUESS_STATUS.CORRECT_GUESS)
		return {
			color: "green.200",
			bgColor: "green.200",
		};

	return {
		color: "neutral.100",
		bgColor: "black.500",
	};
};
