import { ILeague } from "@/domains/league/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import { OverflowAuto } from "@/domains/ui-system/utils";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";

export const LeaguesList = ({ leagues }: { leagues: ILeague[] }) => {
	return (
		<GridOfCards component="ul" data-ui="leagues-list">
			{leagues?.map((league: ILeague) => (
				<li>
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

const GridOfCards = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		borderRadius: theme.spacing(1),
		display: "grid",
		...OverflowAuto(),

		[UIHelper.whileIs("mobile")]: {
			maxHeight: "260px",
			gap: theme.spacing(2),
			overflow: "auto",
			paddingBottom: theme.spacing(2),
			gridAutoColumns: "47%",
			gridAutoRows: "110px",
			gridAutoFlow: "column",
			// gridTemplateRows: "auto auto",
			// gridTemplateColumns: "47% 47%",
		},

		[UIHelper.startsOn("tablet")]: {
			flex: 1,
			gap: theme.spacing(3),
			gridTemplateColumns: "repeat(auto-fill, minmax(150px, 160px))",
			gridTemplateRows: "repeat(auto-fill, 130px)",
		},
	}),
);
