import { CustomLink } from "@/domains/ui-system/components/link/link";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { UIHelper } from "@/theming/theme";
import { Tab, Tabs, TabsList } from "@mui/base";
import { styled, Typography } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { ITournament } from "../typing";

const TournamentTabs = ({ tournament }: { tournament?: ITournament }) => {
	const location = useLocation();
	const lastPath = location.pathname?.split("/").at(-1);

	if (!tournament) return null;

	return (
		<Tabs defaultValue={lastPath}>
			<TabsList slots={{ root: Wrapper }}>
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

				{/* <Tab
					value={"simulator"}
					slots={{
						root: (props) => (
							<CustomTab
								to="/tournaments/$tournamentId/simulator"
								params={{ tournamentId: tournament.id }}
								{...props}
							>
								<Typography variant="tag" textTransform="uppercase">
									simulator
								</Typography>
							</CustomTab>
						),
					}}
				/> */}
			</TabsList>
		</Tabs>
	);
};

const Wrapper = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		border: `1px solid ${theme.palette.teal[500]}`,
		borderRadius: 2,
		padding: 0.5,
		gap: 0.5,

		[UIHelper.startsOn("tablet")]: {
			// maxWidth: "400px",
			marginLeft: "auto",
		},
	}),
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

		[UIHelper.startsOn("tablet")]: {
			minWidth: "200px",
		},
	}),
);

export const TabsSkeleton = styled(Wrapper)(({ theme }) =>
	theme.unstable_sx({
		height: "41px",
		border: "none",
		...shimmerEffect(),
	}),
);
export default {
	Component: TournamentTabs,
	Skeleton: TabsSkeleton,
};
