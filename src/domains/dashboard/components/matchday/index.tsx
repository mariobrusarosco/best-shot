import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";

import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import { theme } from "@/theming/theme";
import { IMatchday } from "../../typing";
import { DashCard } from "../dash-card/dash-card";
import { MatchdayCard, MatchdayGrid } from "./styles";

const Matchday = ({ matchday }: { matchday: IMatchday }) => {
	const allMatches = matchday.all;

	return (
		<Stack color="neutral.100" gap={3}>
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Component
					bgcolor="teal.500"
					color="neutral.100"
					height={20}
					width="120px"
				>
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
						<MatchdayCard key={i}>
							<AppLinkCard
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: match.tournamentId }}
								search={{ round: match.roundId }}
								adornment={
									<Typography
										fontWeight={500}
										textTransform="uppercase"
										variant="tag"
									>
										{match.tournamentLabel}
									</Typography>
								}
								replace={false}
								resetScroll={false}
							>
								<Typography
									fontWeight={500}
									textTransform="uppercase"
									variant="tag"
									color={theme.palette.teal[500]}
								>
									round {match.roundId}
								</Typography>
							</AppLinkCard>
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
		<Stack color="neutral.100" gap={3}>
			<Stack direction="row" justifyContent="space-between">
				<AppPill.Skeleton height={20} width="120px" />
			</Stack>

			<MatchdayGrid>
				<DashCard.Skeleton />
				<DashCard.Skeleton />
			</MatchdayGrid>
		</Stack>
	);
};

export default {
	Component: Matchday,
	Skeleton: MatchdaySkeleton,
};
