import { Box, Typography } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import type { IMatch } from "@/domains/match/typing";
import {
	MatchesFilter,
	type MatchesFilterStatus,
} from "@/domains/tournament/components/tournament-matches/matches-filters";
import {
	Container,
	RoundSelectorContainer,
} from "@/domains/tournament/components/tournament-matches/styles";
import theme from "@/domains/ui-system/theme";
import type { TournamentView } from "@/stores/user-preferences-store";

interface TournamentMatchesProps {
	selectedRound: string | undefined;
	matchesQuery: UseQueryResult<IMatch[]>;
	view: TournamentView;
}

export const TournamentMatches = ({
	selectedRound,
	matchesQuery,
	view,
}: TournamentMatchesProps) => {
	const [activeFilter, setActiveFilter] = useState<MatchesFilterStatus>("all");

	if (matchesQuery.isLoading || matchesQuery.isFetching) {
		return <LoadingState />;
	}
	if (matchesQuery.isError) return null;

	const matches = matchesQuery?.data ?? [];
	console.log("matches...", { matches });
	console.log(matchesQuery.isLoading || !matchesQuery.isFetching);

	if (view === "timeline") {
		return (
			<div data-ui="tournament-matches-timeline">
				<Typography variant="h4" color="neutral.100" textTransform="uppercase" fontWeight={900}>
					We are working to support Time!line matches
				</Typography>
			</div>
		);
	}

	if (view === "calendar") {
		return (
			<div data-ui="tournament-matches-calendar">
				<Typography variant="h4" color="neutral.100" textTransform="uppercase" fontWeight={900}>
					We are working to support Calendar matches
				</Typography>
			</div>
		);
	}

	return (
		<Container data-ui="tournament-matches-round" data-selected-round={selectedRound}>
			<Box display="flex" alignItems="center" gap={1}>
				<Typography variant="subtitle1" color="neutral.100" fontWeight={900}>
					These are the matches of round
				</Typography>

				<RoundSelectorContainer>
					<Typography
						variant="subtitle1"
						color="neutral.100"
						textTransform="uppercase"
						fontWeight={900}
					>
						{selectedRound}
					</Typography>
				</RoundSelectorContainer>
			</Box>
			<MatchesFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
		</Container>
	);
};

const LoadingState = () => (
	<Container data-ui="tournament-matches-loading">
		<Box
			sx={{
				backgroundColor: "neutral.300",
				borderRadius: theme.borderRadius.medium,
				width: "430px",
				height: "300px",
			}}
		></Box>
	</Container>
);
