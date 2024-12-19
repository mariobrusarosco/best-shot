import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import TournamentHeading, {
	TournamentLogo,
} from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { UIHelper } from "@/theming/theme";
import { Box, styled } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { ScreenLayout } from "../ui-system/layout/screen-layout";
import { ScreenMainContent } from "../ui-system/layout/screen-main-content";

const TournamentLayout = () => {
	const tournament = useTournament();

	if (tournament.isPending) {
		return (
			<ScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent
					sx={{
						[UIHelper.whileIs("mobile")]: {
							px: 0.5,
						},
					}}
				>
					<TournamentHeading.Skeleton />
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (tournament.isError) {
		throw tournament.error;
	}

	return (
		<ScreenLayout data-ui="tournament-page" overflow="hidden">
			<ScreenHeading
				title={tournament.data?.label}
				subtitle={tournament.data?.season}
				backTo="/tournaments"
			>
				<LogoBox>
					<TournamentLogo src={tournament.data?.logo} />
				</LogoBox>
			</ScreenHeading>

			<ScreenMainContent
				sx={{
					[UIHelper.whileIs("mobile")]: {
						px: 1,
					},
				}}
			>
				<TournamentHeading.Component tournament={tournament} />

				<Outlet />
			</ScreenMainContent>
		</ScreenLayout>
	);
};

const LogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		img: {
			maxHeight: "110px",
			maxWidth: "110px",
		},
	}),
);

export { TournamentLayout };
