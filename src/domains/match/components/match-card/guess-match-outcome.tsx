import { Typography } from "@mui/material";
import type { IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/app-pill";

export const GuessMatchOutcome = ({ guess }: { guess: IGuess }) => {
	if (guess.status !== "finalized") return null;
	const label = guess.fullMatch.label.replaceAll("_", " ");

	if (guess.fullMatch.status === "incorrect")
		return (
			<AppPill.Component bgcolor="red.400" width={85} height={20}>
				<Typography color="neutral.100" variant="tag" fontWeight={600} textTransform="lowercase">
					{label}
				</Typography>
			</AppPill.Component>
		);

	return (
		<AppPill.Component bgcolor={"green.200"} width={85} height={20}>
			<Typography variant="tag" color="neutral.100" fontWeight={600} textTransform="lowercase">
				{label}
			</Typography>
		</AppPill.Component>
	);
};
