import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import TournamentHeading, {
	TournamentLogo,
} from "@/domains/tournament/components/tournament-heading";
import TournamentTabs from "@/domains/tournament/components/tournament-tabs";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const TournamentLayout = () => {
	const tournament = useTournament();
	const isEmptyState = tournament.data?.rounds?.length === 0;

	if (tournament.isPending) {
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
		throw "sadsadsa";
	}

	return (
		<AuthenticatedScreenLayout data-ui="tournament-page" overflow="hidden">
			<ScreenHeading backTo="/tournaments">
				<CustomScreenHeading>
					<LabelAndLogo>
						<Stack>
							<Typography
								data-ui="title"
								variant="h4"
								textTransform="lowercase"
							>
								{tournament.data?.label}
							</Typography>

							<Typography
								data-ui="subtitle"
								variant={"paragraph"}
								color="teal.500"
								minHeight="18px"
							>
								{tournament.data?.season}
							</Typography>
						</Stack>
						<LogoBox>
							<TournamentLogo src={tournament.data?.logo} />
						</LogoBox>
					</LabelAndLogo>

					<TournamentTabs.Component tournament={tournament.data} />
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
	[UIHelper.whileIs("mobile")]: {
		padding: theme.spacing(0, 1),
	},

	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		gap: theme.spacing(3),
		alignItems: "center",
		justifyContent: "space-between",
		flex: 1,
	},
}));

const LabelAndLogo = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
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
