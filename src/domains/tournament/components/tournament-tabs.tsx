import { Tab, Tabs, TabsList } from "@mui/base";
import { Box, styled, Typography } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { CustomLink } from "@/domains/ui-system/components/link/link";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { UIHelper } from "@/domains/ui-system/theme";
import type { ITournament } from "../schemas";

const TournamentTabs = ({ tournament }: { tournament?: ITournament }) => {
	const location = useLocation();
	const lastPath = location.pathname?.split("/").at(-1);

	if (!tournament) return null;

	return (
		<Tabs defaultValue={lastPath} slots={{ root: Wrapper }}>
			<TabsList slots={{ root: List }}>
				<Tab
					value={"matches"}
					slots={{
						root: (props) => (
							<CustomTab
								to="/tournaments/$tournamentId/matches"
								params={{ tournamentId: tournament.id }}
								{...props}
							>
								<Typography variant="tag" textTransform="uppercase">
									matches
								</Typography>
							</CustomTab>
						),
					}}
				/>
				<Tab
					value={"performance"}
					slots={{
						root: (props) => (
							<CustomTab
								to="/tournaments/$tournamentId/performance"
								params={{ tournamentId: tournament.id }}
								{...props}
							>
								<Typography variant="tag" textTransform="uppercase">
									performance
								</Typography>
							</CustomTab>
						),
					}}
				/>
			</TabsList>
		</Tabs>
	);
};

const Wrapper = styled(Box)(() => ({
	alignContent: "flex-end",
}));

const List = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		border: `1px solid ${theme.palette.teal[500]}`,
		borderRadius: 2,
		padding: 0.5,
		gap: 0.5,

		[UIHelper.startsOn("tablet")]: {
			maxWidth: "400px",
			flexDirection: "column",
			// marginTop: "auto",
			justifyItems: "flex-start",
		},
	})
);

const CustomTab = styled(CustomLink)(({ theme }) =>
	theme?.unstable_sx({
		color: "neutral.100",
		px: 0.5,
		py: 0.5,
		borderRadius: 2,
		flex: 1,
		textAlign: "center",

		"[aria-selected='true']&": {
			backgroundColor: "teal.500",
		},

		[UIHelper.startsOn("desktop")]: {
			minWidth: "200px",
		},
	})
);

export const TabsSkeleton = styled(Wrapper)(({ theme }) =>
	theme.unstable_sx({
		position: "relative",
		height: "41px",
		border: "none",
		...shimmerEffect(),
	})
);
export default {
	Component: TournamentTabs,
	Skeleton: TabsSkeleton,
};
