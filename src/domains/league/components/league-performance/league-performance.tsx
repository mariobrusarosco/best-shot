import { useLeague } from "@/domains/league/hooks/use-league";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";

export const LeaguePerformance = ({
	league,
	mutation,
}: {
	league?: ReturnType<typeof useLeague>["league"];
	mutation: ReturnType<typeof useLeague>["mutation"];
}) => {
	console.log(performance);

	const leagueId = league?.data?.id || "";
	const queryClient = useQueryClient();

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
				<AppPill.Component
					bgcolor="teal.500"
					color="neutral.100"
					width={130}
					height={25}
					mb={2}
				>
					<Typography variant="tag">top 5 performances</Typography>
				</AppPill.Component>

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
						{new Date().toISOString()}
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
							await mutation.mutateAsync();
							queryClient.invalidateQueries({
								queryKey: ["leagues", { leagueId }],
							});
						}}
					>
						<Typography variant="caption" color="neutral.100">
							Update leaderboard
						</Typography>
					</AppButton>
				</Box>
			</Box>

			<GridOfCards>
				<Card>adsda</Card>
			</GridOfCards>
		</Box>
	);
};

// TODO Unify this Card, if possible
export const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		gap: 2,
		flex: 1,
	}),
);
