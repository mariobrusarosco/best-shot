import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useTournamentPerformance } from "../../hooks/use-tournament-performance";

export const TournamentPerformanceStats = ({
	query,
	mutation,
}: {
	query?: ReturnType<typeof useTournamentPerformance>["query"];
	mutation: ReturnType<typeof useTournamentPerformance>["mutation"];
}) => {
	console.log({ query, mutation });

	return (
		<Box
			sx={{
				mt: 5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<AppPill
					bgcolor="teal.500"
					color="neutral.100"
					width={130}
					height={25}
					mb={2}
				>
					<Typography variant="tag">lorem</Typography>
				</AppPill>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="teal.500"
					>
						last updated at:
					</Typography>
					<Typography
						textTransform="uppercase"
						variant="caption"
						color="neutral.100"
					>
						{query?.data?.lastUpdated &&
							new Date(query.data.lastUpdated).toUTCString()}
					</Typography>
					<AppButton
						sx={{
							width: "150px",
							height: "30px",
							borderRadius: 2,
							backgroundColor: "teal.500",
						}}
						// disabled={setup.isPending}
						onClick={async () => {
							mutation.mutate();
						}}
					>
						<Typography variant="caption" color="neutral.100">
							Update
						</Typography>
					</AppButton>
				</Box>
			</Box>

			{/* <GridOfCards>
				<Card>adsda</Card>
			</GridOfCards> */}
		</Box>
	);
};

// TODO Unify this Card, if possible
export const Card = styled(GridOfCards)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "grid",
	}),
);
