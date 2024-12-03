import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Box from "@mui/system/Box";
import { useTournamentRounds } from "../hooks/use-tournament-rounds";

export const TournamentRoundsBar = ({
	tournament,
}: {
	tournament: ReturnType<typeof useTournament>;
}) => {
	const { activeRound, goToRound } = useTournamentRounds();

	return (
		<Box
			sx={{
				overflow: "hidden",
				width: "100vw",
			}}
			data-ui="tournament-rounds-bar"
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 2,
					pb: 2,
				}}
			>
				<Pill bgcolor="teal.500" color="neutral.100" width={70} height={20}>
					<Typography variant="tag">rounds</Typography>
				</Pill>

				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Button
						sx={{
							color: "teal.500",
							display: "flex",
							placeItems: "center",
							p: 1,
							gap: 1,
						}}
					>
						<Typography
							variant="tag"
							color="neutral.100"
							textTransform="lowercase"
						>
							standings
						</Typography>
						<AppIcon name="ChevronRight" size="extra-small" />
					</Button>
				</Box>
			</Box>

			<Surface
				sx={{
					display: "flex",
					flexDirection: "column",
					backgroundColor: "black.800",
					borderRadius: 2,
					px: 2,
					pt: 3,
					pb: 2,
					gap: 2,
					overflow: "hidden",
					position: "sticky",
					top: 0,
					left: 0,
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridAutoFlow: "column",
						overflow: "auto",
						gap: 1.5,
						pb: 2,
					}}
				>
					{Array.from({
						length: Number(tournament.serverState.data?.rounds),
					}).map((_, i) => (
						<RoundButton
							onClick={() => goToRound(i + 1)}
							data-active={activeRound === i + 1}
						>
							<Typography variant="label" color="currentcolor">
								{i + 1}
							</Typography>
						</RoundButton>
					))}
				</Box>
			</Surface>
		</Box>
	);
};

// background changes if active
const RoundButton = styled(Button)(
	({ theme }) => `
		background-color: transparent;
		color: ${theme.palette.teal[500]};
		padding: ${theme.spacing(1)};
		border-radius: ${theme.shape.borderRadius}px;
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		border-color: ${theme.palette.teal[500]};
		border-width: 1px;
		border-style: solid;


		&[data-active="true"] {
			background-color: ${theme.palette.teal[500]};
			color: ${theme.palette.neutral[100]};
		}
	`,
);
