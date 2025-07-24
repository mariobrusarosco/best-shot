import { IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";

export const GuessPoints = ({ guess }: { guess: IGuess }) => {
	if (guess.status !== "finalized") return;
	console.log({ guess });

	return (
		<AppPill.Component bgcolor="black.500" width={75} height={20}>
			<Stack direction="row" gap={2}>
				<Typography
					variant="tag"
					textTransform="uppercase"
					color="teal.500"
					fontWeight={500}
				>
					points
				</Typography>
				<Typography variant="tag" color="neutral.100" fontWeight={500}>
					{guess.total}
				</Typography>
			</Stack>
		</AppPill.Component>
	);
};
