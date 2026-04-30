import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Icon } from "@tabler/icons-react";
import {
	IconCalendarFilled,
	IconLayoutListFilled,
	IconListDetailsFilled,
} from "@tabler/icons-react";
import { useTournamentViewMode } from "@/domains/tournament/hooks/use-tournament-view-mode";
import { UIHelper } from "@/domains/ui-system/theme";
import { lineClamp } from "@/domains/ui-system/utils";
import type { TournamentViewMode } from "@/stores/user-preferences-store";

interface Props {
	label: string;
	currentRound: string | null | undefined;
	logoUrl: string;
}

const viewModeOptions: {
	label: string;
	value: TournamentViewMode;
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

export const TournamentHeading = ({ label, currentRound, logoUrl }: Props) => {
	const { tournamentViewMode, setTournamentViewMode } = useTournamentViewMode();

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
					{label}
				</Typography>

				{currentRound && (
					<Stack gap={0.5}>
						<Typography variant="paragraph" color="black.300">
							current round
						</Typography>
						<CurrentRound>
							<Typography variant="paragraph" color="neutral.100" textTransform="uppercase">
								{currentRound}
							</Typography>
						</CurrentRound>
					</Stack>
				)}

				<TournamentLogo src={logoUrl} alt={label} />
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
							isActive$={tournamentViewMode === value}
							aria-pressed={tournamentViewMode === value}
							aria-label={`Set tournament view mode to ${viewModeLabel}`}
							onClick={() => setTournamentViewMode(value)}
						>
							<Icon size={24} />
						</ViewModeButton>
					))}
				</ViewModeButtons>
			</ViewModePanel>
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(4),
}));

const TournamentData = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.neutral[200],
	padding: theme.spacing(2.5, 2),
	borderRadius: theme.borderRadius.medium,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: theme.spacing(2),
	width: "430px",

	[UIHelper.whileIs("mobile")]: {
		width: "100%",
	},
	[UIHelper.startsOn("tablet")]: {
		width: "520px",
	},
}));

const CurrentRound = styled(Box)(({ theme }) => ({
	display: "flex",
	width: "fit-content",
	padding: theme.spacing(1, 1.5),
	backgroundColor: theme.palette.teal[600],
	borderRadius: theme.borderRadius.medium,
	minWidth: "10px",
}));

const ViewModePanel = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
}));

const ViewModeButtons = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
}));

const ViewModeButton = styled("button", {
	shouldForwardProp: (prop) => prop !== "isActive$",
})<{
	isActive$: boolean;
}>(({ theme, isActive$ }) => ({
	padding: theme.spacing(1),
	borderRadius: theme.borderRadius.medium,
	backgroundColor: isActive$ ? theme.palette.teal[600] : "transparent",
	color: theme.palette.neutral[100],
	cursor: "pointer",
}));

export const TournamentLogo = styled("img")(() => ({
	width: "60px",
}));

export const TournamentHeadingSkeleton = () => {
	return (
		<TournamentData
			data-ui="tournament-heading-loading"
			sx={{ backgroundColor: "black.100" }}
		></TournamentData>
	);
};
