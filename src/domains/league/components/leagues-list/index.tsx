import { ILeague } from "@/domains/league/typing";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import Typography from "@mui/material/Typography/Typography";
import { Box } from "@mui/system";

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
