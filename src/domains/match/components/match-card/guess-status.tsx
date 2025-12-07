import { Stack, Typography } from "@mui/material";
import type { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { theme } from "@/domains/ui-system/theme";

export const GuessStatus = ({ guess }: { guess: IGuess }) => {
	if (guess.status === "paused")
		return (
			<AppPill.Component data-ui="guess-status-postponed" bgcolor="pink.700" width={80} height={15}>
				<Typography variant="tag">postponed</Typography>
			</AppPill.Component>
		);

	if (guess.status === "expired")
		return (
			<AppPill.Component data-ui="guess-status-expired" bgcolor="red.400" width={60} height={15}>
				<Typography variant="tag">expired</Typography>
			</AppPill.Component>
		);

	if (guess.status === "waiting_for_game" && guess.hasLostTimewindowToGuess)
		return (
			<AppPill.Component
				data-ui="guess-status-waiting-for-game"
				bgcolor={"teal.500"}
				width={105}
				height={15}
			>
				<Stack direction="row" gap={1} alignItems="center" justifyContent={"center"}>
					<AppIcon name="ClockFilled" size="tiny" color={theme.palette.neutral[100]} />
					<Typography fontWeight={500} variant="tag" color="neutral.100">
						waiting result
					</Typography>
				</Stack>
			</AppPill.Component>
		);

	if (guess.status === "waiting_for_game")
		return (
			<AppPill.Component
				data-ui="guess-status-good-luck"
				bgcolor={"teal.500"}
				width={75}
				height={20}
			>
				<Typography fontWeight={500} variant="tag" color="neutral.100">
					good luck
				</Typography>
			</AppPill.Component>
		);

	if (guess.status === "not-started")
		return (
			<AppPill.Component
				data-ui="guess-status-open"
				border="1px solid"
				borderColor="neutral.100"
				width={60}
				height={20}
			>
				<Typography fontWeight={500} color="neutral.100" variant="tag">
					open
				</Typography>
			</AppPill.Component>
		);
};
