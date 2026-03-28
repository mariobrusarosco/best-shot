import { Box, styled, Typography } from "@mui/material";
import { useState } from "react";
import {
	LeagueTournamentCustomization,
	TournamentLeagueCard,
} from "@/domains/league/components/league-tournament-customization/league-tournament-customization";
import type { useLeague } from "@/domains/league/hooks/use-league";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";

export const LeagueTournaments = ({
	league,
}: {
	league: ReturnType<typeof useLeague>["league"]["data"];
}) => {
	const [editMode, setEditMode] = useState(false);

	const { tournaments } = useTournaments();
	const toggleEditMode = () => {
		setEditMode((prev) => !prev);
	};

	const isEmptyState = league?.tournaments.length === 0;
	const hasPermissionToEdit = league?.permissions.edit;

	console.log("league", league);
	const trackedTournaments = league?.tournaments.filter((t) => t.status === "tracked");

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pb: 3,
				}}
			>
				<AppPill.Component bgcolor="teal.500" color="neutral.100" width={100} height={25}>
					<Typography variant="tag">Tournaments</Typography>
				</AppPill.Component>

				{hasPermissionToEdit ? (
					<EmptyStartButton onClick={toggleEditMode} sx={{ p: 1 }}>
						<AppIcon name="Settings" size="extra-small" />
					</EmptyStartButton>
				) : null}
			</Box>

			{!editMode && trackedTournaments && (
				<ListGrid data-ui="league-tournament-list">
					{trackedTournaments?.map((tournament) => (
						<TournamentLeagueCard key={tournament.id} tournament={tournament} />
					))}
				</ListGrid>
			)}

			{isEmptyState && !editMode && (
				<EmptyState>
					<Typography variant="caption">
						It seems you don't have selected any tournament to be used on this league scout
					</Typography>
				</EmptyState>
			)}

			{editMode && league && (
				<LeagueTournamentCustomization
					allTournaments={tournaments.data}
					league={league}
					onUpdate={toggleEditMode}
				/>
			)}
		</Box>
	);
};

const EmptyState = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	gap: theme.spacing(4),
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
	marginTop: theme.spacing(4),
	color: theme.palette.neutral[100],
}));

const EmptyStartButton = styled(AppButton)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	padding: theme.spacing(1),
	borderRadius: theme.shape.borderRadius,
	maxWidth: "180px",
}));

const ListGrid = styled("ul")(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1),
	flexWrap: "wrap",
	margin: 0,
	padding: 0,
	listStyle: "none",
}));
