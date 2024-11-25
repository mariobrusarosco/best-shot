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
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 2,
					pb: 0.5,
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
					{Array.from({ length: 38 }).map((_, i) => (
						<Button
							sx={{
								color: "teal.500",
								p: 1,
								borderRadius: 2,
								width: 32,
								height: 32,
								display: "grid",
								borderColor: "teal.500",
								borderWidth: "1px",
								borderStyle: "solid",
							}}
							onClick={() => tournamentState?.goToRound(i)}
						>
							<Typography variant="label" color="teal.500">
								{i}
							</Typography>
						</Button>
					))}
				</Box>
			</Surface>
		</Box>
	);
};
