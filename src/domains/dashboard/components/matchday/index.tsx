import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";

import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppCard } from "@/domains/ui-system/components/card/card";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { theme } from "@/theming/theme";
import { Link } from "@tanstack/react-router";
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
							<Link
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: match.tournamentId }}
								search={{ round: match.roundId }}
								replace={false}
								resetScroll={false}
							>
								<AppCard.Container
									data-ui="card-container"
									sx={{
										gridTemplateRows: "10px auto",
									}}
								>
									<AppCard.Header
										alignItems={"self-start"}
										gap={2}
										data-ui="card-header"
									>
										<Stack minWidth="100px">
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
									</AppCard.Header>
									<Typography
										variant="topic"
										color={theme.palette.teal[500]}
										fontWeight={400}
									>
										round {match.roundId}
									</Typography>
								</AppCard.Container>
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
