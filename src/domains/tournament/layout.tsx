import { Box, styled, Typography } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import TournamentHeading, {
	TournamentLogo,
} from "@/domains/tournament/components/tournament-heading";
import TournamentTabs from "@/domains/tournament/components/tournament-tabs";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";

const TournamentLayout = () => {
	const tournament = useTournament({ fetchOnMount: true });
	const isEmptyState = tournament.isSuccess && tournament.data?.onboardingCompleted === false;

	if (tournament.isRefetching || tournament.isPending) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentHeading.Skeleton />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (tournament.isError) {
		throw "Error";
	}

	return (
		<AuthenticatedScreenLayout data-ui="tournament-page" overflow="hidden">
			<ScreenHeading backTo="/tournaments" dynamicHeight="223">
				<CustomScreenHeading data-ui="custom-screen-heading">
					<LabelAndLogo>
						<Typography data-ui="title" variant="h4" textTransform="lowercase">
							{tournament.data.label}
						</Typography>

						<LogoBox>
							<TournamentLogo src={tournament.data?.logo} />
						</LogoBox>
					</LabelAndLogo>

					{isEmptyState ? null : <TournamentTabs.Component tournament={tournament.data} />}
				</CustomScreenHeading>
			</ScreenHeading>

			<CustomScreenContent data-ui="tournament-content">
				{isEmptyState ? null : <TournamentHeading.Component />}
				<Outlet />
			</CustomScreenContent>
		</AuthenticatedScreenLayout>
	);
};

const CustomScreenContent = styled(ScreenMainContent)(({ theme }) => ({
	[UIHelper.whileIs("mobile")]: {
		padding: theme.spacing(0, 1),
	},

	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		flexDirection: "column",
	},
}));

const CustomScreenHeading = styled(Box)(({ theme }) => ({
	display: "flex",
	flex: 1,
	gap: theme.spacing(2),

	[UIHelper.whileIs("mobile")]: {
		flexDirection: "column",
		justifyContent: "space-between",
	},

	[UIHelper.startsOn("tablet")]: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
	},
}));

const LabelAndLogo = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		justifyContent: "flex-start",
		gap: theme.spacing(1),
		maxWidth: "350px",
	},
}));

const LogoBox = styled(Box)(() => ({
	img: {
		maxHeight: "110px",
		maxWidth: "110px",

		[UIHelper.startsOn("tablet")]: {
			maxHeight: "150px",
			maxWidth: "150px",
		},
	},
}));

export { TournamentLayout };
