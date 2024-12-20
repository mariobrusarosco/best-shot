import { IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, styled, Typography } from "@mui/material";

export const ScoreDisplay = ({
	score,
}: {
	score: number | null;
	guess: IGuess;
}) => {
	return (
		<Wrapper data-ui="score-display">
			<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{score ?? "-"}</Typography>
			</AppPill.Component>
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(() => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 1,
	width: "30px",

	"[data-card-open='true'] &": {
		display: "none",
	},
}));
