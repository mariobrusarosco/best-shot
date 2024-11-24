import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";

export const TournamentRoundsBar = ({
	tournamentState,
}: {
	tournamentState?: ReturnType<typeof useTournament>["uiState"];
}) => {
	return (
		<Surface
			sx={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "black.800",
				borderRadius: 2,
				p: 2,
				pb: 1,
				gap: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexGrow: 1,
					gap: 2,
				}}
			>
				<Typography
					variant="topic"
					color="neutral.100"
					textTransform="lowercase"
				>
					rounds
				</Typography>

				<Pill bgcolor="teal.500" onClick={tournamentState?.handleNextRound}>
					<Typography
						variant="topic"
						color="neutral.100"
						textTransform="lowercase"
					>
						round {tournamentState?.activeRound}
					</Typography>
				</Pill>

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

			<Box
				sx={{
					display: "grid",
					gridAutoFlow: "column",
					overflow: "auto",
					gap: 1.5,
					pb: 2,
				}}
			>
				{Array.from({ length: 38 }).map((_, i) => (
					<Button
						sx={{
							color: "teal.500",
							p: 1,
							borderRadius: 1,
							width: 32,
							height: 32,
							display: "grid",
							borderColor: "teal.500",
							borderWidth: "1px",
							borderStyle: "solid",
						}}
						onClick={() => tournamentState?.goToRound(i)}
					>
						<Typography variant="label" color="neutral.100">
							{i}
						</Typography>
					</Button>
				))}
			</Box>
		</Surface>
	);
};
