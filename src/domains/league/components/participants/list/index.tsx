import { ILeague } from "@/domains/league/typing";
import { AppCard } from "@/domains/ui-system/components/card/card";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import Typography from "@mui/material/Typography/Typography";

export const ParticipantsList = ({ leagues }: { leagues: ILeague[] }) => {
	return (
		<GridOfCards component="ul" data-ui="leagues-list">
			{leagues?.map((league: ILeague) => (
				<li>
					<AppCard.Container>
						<Typography variant="label" textTransform="uppercase">
							{league.label}
						</Typography>
					</AppCard.Container>
				</li>
			))}
		</GridOfCards>
	);
};
