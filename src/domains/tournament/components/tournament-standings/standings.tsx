import { Box, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { IconLayoutSidebarLeftExpandFilled } from "@tabler/icons-react";
import { useState } from "react";
import { CompactStandings } from "@/domains/tournament/components/tournament-standings/compact";
import { useTournamentStandings } from "@/domains/tournament/hooks/use-tournament-standings";
import { UIHelper } from "@/domains/ui-system/theme";

interface Props {
	tournamentId: string;
}

export const Standings = ({ tournamentId }: Props) => {
	const theme = useTheme();
	const [mode, setMode] = useState<"compact" | "full">("compact");
	const [isOpen, setIsOpen] = useState(true);
	const { query } = useTournamentStandings({ tournamentId });

	return (
		<Container data-ui="standings" isOpen$={isOpen}>
			<Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
				<Typography variant="h4" color="black.300" textTransform="uppercase" fontWeight="bold">
					Standings
				</Typography>

				<IconLayoutSidebarLeftExpandFilled
					size={32}
					fill={theme.palette.black[300]}
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
				/>
			</Box>

			{isOpen ? (
				<Box display="flex" gap={1} alignItems="center">
					<ModeToggle onClick={() => setMode("compact")} isActive$={mode === "compact"}>
						<Typography variant="paragraph" textTransform="uppercase">
							compact
						</Typography>
					</ModeToggle>

					<ModeToggle onClick={() => setMode("full")} isActive$={mode === "full"}>
						<Typography variant="paragraph" textTransform="uppercase">
							full
						</Typography>
					</ModeToggle>
				</Box>
			) : (
				<Typography variant="label_1" color="black.300">
					toggle to view standings
				</Typography>
			)}

			{isOpen ? (
				<Box display="flex" gap={1} alignItems="center">
					{mode === "compact" ? <CompactStandings teams={query.data?.teams} /> : null}
				</Box>
			) : null}
		</Container>
	);
};

export const StandingsSkeleton = () => {
	return (
		<Container
			data-ui="standings-skeleton"
			isOpen$={true}
			sx={{ backgroundColor: "black.100" }}
		></Container>
	);
};

const Container = styled(Stack)<{
	isOpen$: boolean;
}>(({ theme, isOpen$ }) => ({
	position: "absolute",
	right: 0,
	top: 0,

	backgroundColor: theme.palette.neutral[200],
	padding: theme.spacing(3),
	borderRadius: theme.borderRadius.medium,
	width: isOpen$ ? 350 : 230,
	justifyContent: "space-between",
	gap: theme.spacing(0.5),

	[UIHelper.whileIs("mobile")]: {
		// TODO
	},
	[UIHelper.startsOn("tablet")]: {
		// TODO
	},
}));

const ModeToggle = styled(Box)<{
	isActive$: boolean;
}>((props) => ({
	display: "grid",
	cursor: "pointer",
	padding: props.theme.spacing(1, 1.5),
	borderRadius: props.theme.borderRadius.medium,
	border: `1px solid ${props.theme.palette.black[300]}`,

	...(props.isActive$ && {
		backgroundColor: props.theme.palette.teal[600],
		borderColor: "transparent",
		color: props.theme.palette.neutral[100],
	}),
}));
