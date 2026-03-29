import { Box, Stack, styled, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { InviteToLeagueDialog } from "@/domains/league/components/invite-to-league-dialog";
import { LeagueTournaments } from "@/domains/league/components/league-tournaments/league-tournament-list";
import ParticipantsList from "@/domains/league/components/participants/participants";
import { useLeague } from "@/domains/league/hooks/use-league";
import { type FABAction, FABMenu } from "@/domains/ui-system/components/fab-menu";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";
import { FONT_FAMILIES } from "@/domains/ui-system/theme/foundation/typography";

export const SingleLeagueScreen = () => {
	const { league } = useLeague();
	const hasInvitePermission = league.data?.permissions.invite;
	const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

	const handleOpenInviteDialog = useCallback(() => setIsInviteDialogOpen(true), []);
	const handleCloseInviteDialog = useCallback(() => setIsInviteDialogOpen(false), []);

	// FAB actions - only show invite if user has permission
	const fabActions: FABAction[] = useMemo(
		() =>
			hasInvitePermission
				? [
						{
							id: "invite-someone",
							label: "Invite Someone",
							icon: <AppIcon name="User" size="medium" />,
							onClick: handleOpenInviteDialog,
						},
					]
				: [],
		[hasInvitePermission, handleOpenInviteDialog]
	);

	if (league.states.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading title="league" />
				<ScreenMainContent>
					<League>
						<ParticipantsList.Skeleton />
					</League>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (league.states.isError) {
		return (
			<AuthenticatedScreenLayout data-ui="leagues-screen-error">
				<ScreenHeading title="league" />
				<ScreenMainContent>...error...</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="leagues-screen screen">
			<LeagueDisplay>
				<Typography data-ui="title" variant="h2" textTransform="uppercase" color="black.400">
					League
				</Typography>

				<LeagueName>
					<Typography
						variant="body1"
						color="neutral.0"
						textTransform="lowercase"
						sx={{
							fontFamily: FONT_FAMILIES.heading,
						}}
					>
						{league.data?.label}
					</Typography>
				</LeagueName>
			</LeagueDisplay>

			<ScreenMainContent>
				<League data-ui="league">
					<Stack spacing={2} direction="column" flex={1}>
						<LeagueTournaments league={league.data} />
						{/* <ParticipantsList.Component participants={data.league.participants} /> */}
					</Stack>
				</League>

				{hasInvitePermission && fabActions.length > 0 ? (
					<>
						<FABMenu
							actions={fabActions}
							position={{
								bottom: 24,
								right: 24,
							}}
						/>
						<InviteToLeagueDialog open={isInviteDialogOpen} onClose={handleCloseInviteDialog} />
					</>
				) : null}
			</ScreenMainContent>
		</AuthenticatedScreenLayout>
	);
};

const League = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	borderRadius: theme.spacing(1),
	display: "flex",
	flex: 1,

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
		gap: theme.spacing(2),
	},

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(5),
	},
}));

const LeagueDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: "fit-content",
	gap: theme.spacing(2),
	padding: theme.spacing(3.5),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.shape.medium,
	minWidth: "300px",
}));

const LeagueName = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.shape.medium,
	width: "fit-content",
}));
