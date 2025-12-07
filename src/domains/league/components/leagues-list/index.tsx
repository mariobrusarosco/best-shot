import { Box, styled, Typography } from "@mui/material";
import type { ILeague } from "@/domains/league/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { UIHelper } from "@/domains/ui-system/theme";
import { OverflowAuto } from "@/domains/ui-system/utils";

const LeaguesList = ({ leagues }: { leagues: ILeague[] }) => {
	return (
		<GridOfCards data-ui="leagues-list">
			{leagues?.map((league: ILeague) => (
				<li key={league.id}>
					<AppLinkCard
						to="/leagues/$leagueId"
						params={{ leagueId: league.id }}
						key={league.label}
						adornment={
							<Box color="teal.500">
								<AppIcon name="Users" size="small" />
							</Box>
						}
						replace={false}
						resetScroll={false}
					>
						<Typography variant="label" textTransform="uppercase">
							{league.label}
						</Typography>
					</AppLinkCard>
				</li>
			))}
		</GridOfCards>
	);
};

const GridOfCards = styled("ul")(({ theme }) =>
	theme.unstable_sx({
		borderRadius: theme.spacing(1),
		display: "grid",
		margin: 0,
		padding: 0,
		listStyle: "none",
		...OverflowAuto(),

		[UIHelper.whileIs("mobile")]: {
			maxHeight: "260px",
			gap: theme.spacing(2),
			overflow: "auto",
			paddingBottom: theme.spacing(2),
			gridAutoColumns: "47%",
			gridAutoRows: "110px",
			gridAutoFlow: "column",
		},

		[UIHelper.startsOn("tablet")]: {
			gap: theme.spacing(3),
			gridTemplateColumns: "repeat(auto-fill, minmax(150px, 160px))",
			gridTemplateRows: "repeat(auto-fit, 130px)",
		},
	})
);

const LeaguesListSkeleton = () => {
	// Generate stable keys for skeleton items
	const skeletonKeys = Array.from({ length: 6 }, (_, i) => `skeleton-item-${i}`);

	return (
		<GridOfCards data-ui="leagues-list-skeleton">
			{skeletonKeys.map((key) => (
				<li key={key}>
					<Skeleton />
				</li>
			))}
		</GridOfCards>
	);
};

const Skeleton = styled(Box)(() => ({
	position: "relative",
	height: "110px",
	...shimmerEffect(),
}));

export default {
	Component: LeaguesList,
	Skeleton: LeaguesListSkeleton,
};
