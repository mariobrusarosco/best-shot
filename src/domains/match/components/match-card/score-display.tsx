import { IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, styled, Typography } from "@mui/material";

const ALLOW_SCORE_WHEN_GUESS_STATUS = new Set([
	"expired",
	"correct",
	"incorrect",
	"not-started",
]);

export const ScoreDisplay = ({
	score,
	cardExpanded,
	guess,
}: {
	score: number | null;
	cardExpanded: boolean;
	guess: IGuess;
}) => {
	const showScore =
		ALLOW_SCORE_WHEN_GUESS_STATUS.has(guess.status) && cardExpanded;

	if (!showScore) return null;

	return (
		<Wrapper>
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
	// background: "gold",
	width: "30px",

	// "[data-open='true'] &": {
	// 	order: 2,
	// },
	// "[data-open='true'] [data-venue='away'] &": {
	// 	flexDirection: "row-reverse",
	// },

	// "[data-open='true'][data-guess-status='waiting_for_game'] &": {
	// 	display: "none",
	// },
}));
