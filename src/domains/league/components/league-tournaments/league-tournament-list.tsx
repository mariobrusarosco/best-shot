import { Box, styled, Typography } from "@mui/material";
import { useState } from "react";
import type { useLeague } from "@/domains/league/hooks/use-league";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { AppIcon } from "@/domains/ui-system/components/app-icon";
import { AppPill } from "@/domains/ui-system/components/app-pill";
import {
	LeagueTournamentCustomization,
	TournamentLeagueCard,
} from "../league-tournament-customization/league-tournament-customization";

export const LeagueTournaments = ({
	league,
}: {
	league: ReturnType<typeof useLeague>["league"];
}) => {
	const [editMode, setEditMode] = useState(false);

	const { data: allAppAvailableTournamens } = useTournaments();
	const toggleEditMode = () => {
		setEditMode((prev) => !prev);
	};

	const isEmptyState = league?.isSuccess && league.data?.tournaments.length === 0;
	const hasPermissionToEdit = league?.data?.permissions.edit;

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

			{isEmptyState && !editMode && (
				<EmptyState>
					<Typography variant="caption">
						It seems you don't have selected any tournament to be used on this league scout
					</Typography>
				</EmptyState>
			)}

			{editMode && allAppAvailableTournamens && league.data && (
				<LeagueTournamentCustomization
					currentTournaments={league?.data?.tournaments}
					allTournaments={allAppAvailableTournamens}
					league={league.data}
					onUpdate={toggleEditMode}
				/>
			)}

			{!editMode && allAppAvailableTournamens && league.data && (
				<ListGrid data-ui="league-tournament-list">
					{league?.data?.tournaments.map((tournament) => (
						<TournamentLeagueCard tournament={tournament} />
					))}
				</ListGrid>
			)}
		</Box>
	);
};

const EmptyState = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		flexDirection: "column",
		backgroundColor: "black.800",
		borderRadius: 2,
		gap: 4,
		px: 2,
		py: 4,
		mt: 4,
		color: "neutral.100",
	})
);

const EmptyStartButton = styled(AppButtonBase)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "teal.500",
		color: "neutral.100",
		p: 1,
		borderRadius: 2,
		maxWidth: "180px",
	})
);

const ListGrid = styled("ul")(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		gap: 1,
		flexWrap: "wrap",
		margin: 0,
		padding: 0,
		listStyle: "none",
	})
);
