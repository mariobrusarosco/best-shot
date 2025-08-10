import { Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppCard } from "@/domains/ui-system/components/app-card/AppCard";
import { AppIcon } from "@/domains/ui-system/components/app-icon";
import { AppPill } from "@/domains/ui-system/components/app-pill";
import type { IMatchday } from "../../typing";
import { DashCard } from "../dash-card/dash-card";
import { MatchdayCard, MatchdayGrid } from "./styles";

const Matchday = ({ matchday }: { matchday: IMatchday }) => {
	const allMatches = matchday.all;

	console.log({ matchday });

	return (
		<Stack color="neutral.100" gap={3} data-ui="matchday">
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Component bgcolor="teal.500" color="neutral.100" height={20} width="120px">
					<Typography textTransform="uppercase" variant="tag">
						Matchday
					</Typography>
				</AppPill.Component>
			</Stack>

			<MatchdayGrid>
				{allMatches.length === 0 ? (
					<EmptyState />
				) : (
					allMatches.map((match, i) => (
						<MatchdayCard key={i} data-ui="matchday-card">
							<Link
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: match.tournamentId }}
								search={{ round: match.roundSlug }}
								replace={false}
								resetScroll={false}
							>
								<AppCard
									variant="match"
									data-ui="card-container"
									sx={{
										gridTemplateRows: "10px auto",
										display: "flex",
										flexDirection: "column",
										gap: 2,
										p: 2,
									}}
								>
									<Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2} data-ui="card-header">
										<Stack>
											<Typography
												fontWeight={500}
												textTransform="uppercase"
												variant="tag"
												maxWidth={"1200px"}
												textOverflow={"ellipsis"}
												overflow={"hidden"}
												whiteSpace={"nowrap"}
											>
												{match.tournamentLabel}
											</Typography>
										</Stack>
										<AppButton
											sx={{
												color: "teal.500",
												p: 0,
												borderRadius: "50%",
												display: "grid",
												placeItems: "center",
											}}
										>
											<AppIcon name="ChevronRight" size="extra-small" />
										</AppButton>
									</Stack>
									<Typography variant="tag" color="primary.main" fontWeight={400}>
										round {match.roundSlug}
									</Typography>
								</AppCard>
							</Link>
						</MatchdayCard>
					))
				)}
			</MatchdayGrid>
		</Stack>
	);
};

const EmptyState = () => (
	<Typography variant="label" color="neutral.500">
		No matches for today!
	</Typography>
);

const MatchdaySkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3} data-ui="matchday-skeleton">
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
			</Stack>

			<MatchdayGrid>
				{Array.from({ length: 8 }).map((_, i) => (
					<MatchdayCard key={i} data-ui="matchday-card-skeleton">
						<DashCard.Skeleton sx={{ width: "100px", height: "71px" }} />
					</MatchdayCard>
				))}
			</MatchdayGrid>
		</Stack>
	);
};

export default {
	Component: Matchday,
	Skeleton: MatchdaySkeleton,
};
