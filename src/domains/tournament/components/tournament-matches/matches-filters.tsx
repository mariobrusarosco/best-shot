import { Typography } from "@mui/material";
import {
	RoundsFilter,
	RoundsFilterContainer,
} from "@/domains/tournament/components/tournament-matches/styles";

export type MatchesFilterStatus = "all" | "pending" | "waiting_for_result" | "ended";

interface MatchesFilterProps {
	activeFilter: MatchesFilterStatus;
	onFilterChange: (filter: MatchesFilterStatus) => void;
}

const MATCHES_FILTER_OPTIONS: { label: string; value: MatchesFilterStatus }[] = [
	{ label: "all", value: "all" },
	{ label: "pending", value: "pending" },
	{ label: "waiting for result", value: "waiting_for_result" },
	{ label: "ended", value: "ended" },
];

export const MatchesFilter = ({ activeFilter, onFilterChange }: MatchesFilterProps) => {
	return (
		<RoundsFilterContainer>
			{MATCHES_FILTER_OPTIONS.map((filterOption) => (
				<RoundsFilter
					key={filterOption.value}
					isActive$={activeFilter === filterOption.value}
					onClick={() => onFilterChange(filterOption.value)}
				>
					<Typography
						variant="body1"
						color={activeFilter === filterOption.value ? "black.500" : "neutral.100"}
						textTransform="uppercase"
						fontWeight={900}
					>
						{filterOption.label}
					</Typography>
				</RoundsFilter>
			))}
		</RoundsFilterContainer>
	);
};
