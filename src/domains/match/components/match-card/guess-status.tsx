import { IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";

export const GuessStatus = ({ guess }: { guess: IGuess }) => {
	if (guess.status === "paused")
		return (
			<AppPill.Component bgcolor="pink.700" width={80} height={20}>
				<Typography variant="tag">postponed</Typography>
			</AppPill.Component>
		);

	if (guess.status === "expired")
		return (
			<AppPill.Component
				border="1px solid"
				borderColor="red.400"
				width={60}
				height={20}
			>
				<Typography color="red.400" variant="tag">
					expired
				</Typography>
			</AppPill.Component>
		);

	if (guess.status === "waiting_for_game")
		return (
			<Typography
				fontWeight={600}
				variant="tag"
				color="teal.500"
				textTransform="uppercase"
			>
				good luck!
			</Typography>
		);

	if (guess.status === "not-started")
		return (
			<Typography
				fontWeight={600}
				variant="tag"
				color="teal.500"
				textTransform="uppercase"
			>
				expires in
			</Typography>
		);
};
