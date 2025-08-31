import { Tab, Tabs, TabsList } from "@mui/base";
import { Box, styled, Typography } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { CustomLink } from "@/domains/ui-system/components/link/link";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { UIHelper } from "@/theming/theme";

const AdminTournamentTabs = () => {
	const location = useLocation();
	const lastPath = location.pathname?.split("/").at(-1);

	return (
		<Tabs defaultValue={lastPath} slots={{ root: Wrapper }}>
			<TabsList slots={{ root: List }}>
				<Tab
					value={"home"}
					slots={{
						root: (props) => (
							<CustomTab to="/admin" {...props}>
								<Typography variant="tag" textTransform="uppercase">
									Home
								</Typography>
							</CustomTab>
						),
					}}
				/>
				<Tab
					value={"reports"}
					slots={{
						root: (props) => (
							<CustomTab to="/admin/reports" {...props}>
								<Typography variant="tag" textTransform="uppercase">
									reports
								</Typography>
							</CustomTab>
						),
					}}
				/>
				<Tab
					value={"scheduler-jobs"}
					slots={{
						root: (props) => (
							<CustomTab to="/admin/scheduler-jobs" {...props}>
								<Typography variant="tag" textTransform="uppercase">
									scheduler jobs
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
	minWidth: "400px",
}));

const List = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		border: `1px solid ${theme.palette.teal[500]}`,
		borderRadius: 2,
		padding: 0.5,
		gap: 0.5,

		[UIHelper.startsOn("tablet")]: {},
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
	Component: AdminTournamentTabs,
	Skeleton: TabsSkeleton,
};
