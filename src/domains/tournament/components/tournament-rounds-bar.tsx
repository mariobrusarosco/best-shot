import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import { useTournamentRounds } from "../hooks/use-tournament-rounds";
import { ITournament } from "../typing";

export const TournamentRoundsBar = ({
	tournament,
}: {
	tournament: ITournament;
}) => {
	const { activeRound, goToRound } = useTournamentRounds();

	useEffect(() => {
		if (activeRound) {
			const el = document.querySelector("[data-active='true']");

			el?.scrollIntoView({
				inline: "center",
				block: "center",
			});
		}
	}, [activeRound]);

	return (
		<Wrapper data-ui="tournament-rounds-bar">
			<PillAndStandingLink>
				<AppPill
					border="1px solid"
					borderColor="teal.500"
					bgcolor="black.800"
					color="neutral.100"
					height={25}
					width={1}
					maxWidth="70px"
				>
					<Typography variant="tag">rounds</Typography>
				</AppPill>

				<AppLink
					sx={{
						color: "teal.500",
						placeItems: "center",
						p: 1,
						gap: 1,
						display: {
							all: "flex",
							tablet: "none",
						},
					}}
				>
					<Typography
						variant="tag"
						color="neutral.100"
						textTransform="lowercase"
					>
						standings
					</Typography>
					<AppIcon name="ChevronRight" size="extra-small" />
				</AppLink>
			</PillAndStandingLink>

			<Bar data-ui="bar">
				{Array.from({
					length: Number(tournament.rounds),
				}).map((_, i) => (
					<RoundButton
						onClick={() => goToRound(i + 1)}
						data-active={activeRound === i + 1}
					>
						<Typography variant="label" color="currentcolor">
							{i + 1}
						</Typography>
					</RoundButton>
				))}
			</Bar>
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flexDirection: "column",
		boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",

		[UIHelper.whileIs("mobile")]: {
			alignItems: "center",
			overflow: "hidden",
			position: "fixed",
			bottom: "50px",
			px: 0,
			pt: 2,
			pb: 4,
			width: "100vw",
			backdropFilter: "blur(10px)",
		},

		[UIHelper.startsOn("tablet")]: {
			overflowY: "auto",
			// width: "80px",
			// pb: 5,
			// height: 1,
		},
	}),
);

const PillAndStandingLink = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		gap: 2,
		pb: 2,
		// px: 2,
	}),
);

const AppLink = styled(Box)(({ theme }) => theme?.unstable_sx({}));

const Bar = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		width: 1,
		overflowX: "scroll",
		display: "flex",
		gap: 1.5,
		pb: 1,

		[UIHelper.whileIs("mobile")]: {
			px: 2,
		},

		[UIHelper.startsOn("tablet")]: {
			flexDirection: "column",
			alignItems: "center",
			px: 2,
			mt: 2,
		},
	}),
);

const RoundButton = styled(AppButton)(
	({ theme }) => `
	  scroll-snap-align: center; 
		background-color: transparent;
		color: ${theme.palette.neutral[100]};
		padding: ${theme.spacing(1)};
		border-radius: ${theme.shape.borderRadius}px;
		min-width: 32px;
		min-height: 32px;
		max-width: 40px;
		max-heigh: 40px;
		display: grid;
		place-items: center;
		border-color: ${theme.palette.teal[500]};
		border-width: 1px;
		border-style: solid;

		&[data-active="true"] {
			background-color: ${theme.palette.teal[500]};
			color: ${theme.palette.neutral[100]};
		}
	`,
);
