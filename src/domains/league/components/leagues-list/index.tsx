import { ILeague } from "@/domains/league/typing";
import { LinkCard } from "@/domains/ui-system/components/card/card";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import Typography from "@mui/material/Typography/Typography";

export const LeaguesList = ({ leagues }: { leagues: ILeague[] }) => {
	return (
		<GridOfCards component="ul" data-ui="leagues-list">
			{leagues?.map((league: ILeague) => (
				<li>
					<LinkCard
						to="/leagues/$leagueId"
						params={{ leagueId: league.id }}
						key={league.label}
						adornment={<AppIcon name="Users" size="small" />}
					>
						<Typography variant="label" textTransform="uppercase">
							{league.label}
						</Typography>
					</LinkCard>
				</li>
			))}
		</GridOfCards>
	);
};
