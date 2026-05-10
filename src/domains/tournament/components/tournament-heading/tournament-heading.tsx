import { Box, Stack, Typography } from "@mui/material";
import type { Icon } from "@tabler/icons-react";
import {
	IconCalendarFilled,
	IconLayoutListFilled,
	IconListDetailsFilled,
} from "@tabler/icons-react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useTournamentView } from "@/domains/tournament/hooks/use-tournament-view-mode";
import type { ITournament } from "@/domains/tournament/types";
import theme from "@/domains/ui-system/theme";
import { lineClamp } from "@/domains/ui-system/utils";
import type { TournamentView } from "@/stores/user-preferences-store";
import {
	Container,
	CurrentRound,
	TournamentData,
	TournamentLogo,
	ViewModeButton,
	ViewModeButtons,
	ViewModePanel,
} from "./styles";

interface Props {
	tournamentQuery: UseQueryResult<ITournament>;
}

export const TournamentHeading = ({ tournamentQuery }: Props) => {
	const tournamentView = useTournamentView();

	if (tournamentQuery.isFetching || tournamentQuery.isPending) {
		return <LoadingState />;
	}
	if (tournamentQuery.isError) return null;

	return (
		<Container data-ui="tournament-heading">
			<TournamentData data-ui="tournament-data">
				<Typography
					variant="h4"
					color="black.300"
					textTransform="uppercase"
					fontWeight={900}
					sx={{ ...lineClamp(2) }}
				>
					{tournamentQuery.data.label}
				</Typography>

				{tournamentQuery.data.currentRound && (
					<Stack gap={0.5}>
						<Typography variant="paragraph" color="black.300">
							current round
						</Typography>
						<CurrentRound>
							<Typography variant="paragraph" color="neutral.100" textTransform="uppercase">
								{tournamentQuery.data.currentRound}
							</Typography>
						</CurrentRound>
					</Stack>
				)}

				<TournamentLogo src={tournamentQuery.data.logo} alt={tournamentQuery.data.label} />
			</TournamentData>

			<ViewModePanel data-ui="tournament-view-mode">
				<Typography variant="body_1" color="neutral.100" textTransform="uppercase" fontWeight={700}>
					mode
				</Typography>

				<ViewModeButtons role="group" aria-label="Tournament view mode">
					{viewModeOptions.map(({ value, label: viewModeLabel, Icon }) => (
						<ViewModeButton
							key={value}
							type="button"
							isActive$={tournamentView.view === value}
							aria-pressed={tournamentView.view === value}
							aria-label={`Set tournament view mode to ${viewModeLabel}`}
							onClick={() => tournamentView.setTournamentView(value)}
						>
							<Icon size={24} />
						</ViewModeButton>
					))}
				</ViewModeButtons>
			</ViewModePanel>
		</Container>
	);
};

const LoadingState = () => {
	return (
		<Container data-ui="tournament-heading-loading">
			<TournamentData data-ui="tournament-data" sx={{ backgroundColor: "neutral.300" }}>
				<Typography
					variant="h4"
					color="black.300"
					textTransform="uppercase"
					fontWeight={900}
					sx={{ ...lineClamp(2) }}
				></Typography>

				<Box
					sx={{
						height: 60,
						width: 60,
					}}
				/>
			</TournamentData>

			<ViewModePanel data-ui="tournament-view-mode">
				<ViewModeButtons role="group" aria-label="Tournament view mode">
					<Box
						sx={{
							backgroundColor: "neutral.300",
							height: 100,
							width: 136,
							borderRadius: theme.borderRadius.medium,
						}}
					/>
				</ViewModeButtons>
			</ViewModePanel>
		</Container>
	);
};

// Component's Colocated Utilities
const viewModeOptions: {
	label: string;
	value: TournamentView;
	Icon: Icon;
}[] = [
	{
		label: "timeline",
		value: "timeline",
		Icon: IconListDetailsFilled,
	},
	{
		label: "rounds",
		value: "rounds",
		Icon: IconLayoutListFilled,
	},
	{
		label: "calendar",
		value: "calendar",
		Icon: IconCalendarFilled,
	},
];
