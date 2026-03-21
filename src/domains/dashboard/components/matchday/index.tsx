import { Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { DashCard } from "@/domains/dashboard/components/dash-card/dash-card";
import type { IMatchday } from "@/domains/dashboard/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { MatchdayGrid } from "./styles";

export const Matchday = ({ matchday }: { matchday: IMatchday }) => {
	const allMatches = matchday.all;

	return (
		<Stack color="neutral.100" gap={2} data-ui="matchday">
			<Stack direction="row" justifyContent="space-between">
				<Typography textTransform="uppercase" variant="h3">
					Matchday
				</Typography>
			</Stack>

			<MatchdayGrid>
				{allMatches.length === 0 && <EmptyState />}
				{allMatches.map((match, i) => (
					<Link
						key={`match-${match.tournamentId}-${match.roundSlug}-${i}`}
						to="/tournaments/$tournamentId"
						params={{ tournamentId: match.tournamentId }}
						search={{ round: match.roundSlug }}
						replace={false}
						resetScroll={false}
					>
						<Stack
							data-ui="matchday-card"
							sx={{
								paddingX: 1.5,
								paddingY: 2,
								backgroundColor: "#3A3A3A",
								borderRadius: "8px",
								gap: 2,
								width: "220px",
							}}
						>
							<Typography
								fontWeight={500}
								textTransform="uppercase"
								variant="h6"
								maxWidth={"1200px"}
								textOverflow={"ellipsis"}
								overflow={"hidden"}
								whiteSpace={"nowrap"}
							>
								{match.tournamentLabel}
							</Typography>
							<Stack
								sx={{
									width: "fit-content",
									px: 1.5,
									py: 1,
									backgroundColor: "#5B98A5",
									borderRadius: "4px",
								}}
							>
								<Typography variant="topic" color="neutral.100" fontWeight={400}>
									{match.roundSlug}
								</Typography>
							</Stack>
						</Stack>
					</Link>
				))}
			</MatchdayGrid>
		</Stack>
	);
};

const EmptyState = () => (
	<Typography variant="label" color="neutral.500">
		No matches for today!
	</Typography>
);

export const MatchdaySkeleton = () => {
	// Generate stable keys for skeleton items
	const skeletonKeys = Array.from({ length: 8 }, (_, i) => `skeleton-item-${i}`);

	return (
		<Stack color="neutral.100" gap={3} data-ui="matchday-skeleton">
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
			</Stack>

			<MatchdayGrid>
				{skeletonKeys.map((key) => (
					<DashCard.Skeleton
						key={key}
						data-ui="matchday-card-skeleton"
						sx={{ width: "100px", height: "71px" }}
					/>
				))}
			</MatchdayGrid>
		</Stack>
	);
};
