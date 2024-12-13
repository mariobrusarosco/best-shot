import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useLeaguePerformance } from "../../hooks/use-league-performance";

export const LeaguePerformanceStats = ({
	performance,
	mutation,
}: {
	performance?: ReturnType<typeof useLeaguePerformance>["performance"];
	mutation: ReturnType<typeof useLeaguePerformance>["mutation"];
}) => {
	console.log({ performance, mutation });

	return (
		<Box data-ui="league-performance-stats">
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					mb: 6,
				}}
			>
				<Typography textTransform="uppercase" variant="tag" color="teal.500">
					last updated at:
				</Typography>
				<Typography textTransform="uppercase" variant="tag" color="neutral.100">
					{performance?.data?.lastUpdatedAt &&
						new Date(performance.data.lastUpdatedAt).toUTCString()}
				</Typography>
				<AppButton
					sx={{
						width: "70px",
						height: "30px",
						borderRadius: 2,
						backgroundColor: "teal.500",
					}}
					disabled={mutation.isPending}
					onClick={async () => {
						mutation.mutate();
					}}
				>
					<Typography variant="caption" color="neutral.100">
						Update
					</Typography>
				</AppButton>
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					my: 2,
				}}
			>
				<AppPill bgcolor="teal.500" color="neutral.100" width={110} height={25}>
					<Typography variant="tag">leaderboard</Typography>
				</AppPill>
			</Box>

			<ListGrid>
				{performance?.data?.performances.map((leagueMember, index) => (
					<Card>
						<Box
							sx={{ display: "grid", placeContent: "space-between", gap: 0.5 }}
						>
							<Typography
								variant="label"
								textTransform="lowercase"
								color="black.300"
							>
								pos
							</Typography>
							<AppPill
								bgcolor="teal.500"
								color="neutral.100"
								width={15}
								height={15}
							>
								<Typography variant="tag">{index + 1}</Typography>
							</AppPill>
						</Box>

						<Box
							sx={{ display: "grid", placeContent: "space-between", gap: 0.5 }}
						>
							<Typography
								variant="label"
								textTransform="lowercase"
								color="black.300"
							>
								points
							</Typography>
							<Typography
								color="neutral.100"
								variant="topic"
								textTransform="capitalize"
							>
								{leagueMember.points}
							</Typography>
						</Box>

						<Box
							sx={{
								display: "grid",
								placeContent: "space-between",
								gap: 0.5,
								flex: 1,
							}}
						>
							<Typography
								variant="label"
								textTransform="lowercase"
								color="black.300"
							>
								name
							</Typography>
							<Typography
								color="neutral.100"
								variant="topic"
								textTransform="capitalize"
								width="100%"
								overflow="hidden"
								textOverflow="ellipsis"
							>
								{leagueMember.name}
							</Typography>
						</Box>
					</Card>
				))}
			</ListGrid>
		</Box>
	);
};

// TODO Unify this Card, if possible
export const Card = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "flex",
		flexWrap: "nowrap",
		gap: 2,
	}),
);

export const ListGrid = styled(GridOfCards)(({ theme }) =>
	theme.unstable_sx({
		padding: 0,
		borderRadius: 1,
		gridTemplateColumns: {
			all: "1fr 1fr",
			tablet: "repeat(auto-fit, minmax(270px, 270px))",
		},
		gridAutoRows: {
			all: "70px",
			tablet: "80px",
		},
	}),
);
