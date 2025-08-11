import { Box, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import type { IGuess } from "@/domains/guess/typing";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/app-icon/icon/app-icon";
import { AppSurface } from "@/domains/ui-system/components/app-surface/app-surface";

export const GuessSection = ({
	groupOfGuesses,
	groupName,
}: {
	groupOfGuesses?: IGuess[];
	groupName: string;
}) => {
	const [open, setOpen] = useState(true);

	if (!groupOfGuesses) return null;

	return (
		<Stack mt={3}>
			<Stack direction="row" justifyContent="space-between">
				{groupName ? (
					<Typography
						textTransform="uppercase"
						variant="paragraph"
						color="neutral.100"
						fontWeight={700}
						mb={2}
					>
						all guesses
					</Typography>
				) : null}

				<ToggleButton onClick={() => setOpen((prev) => !prev)}>
					<AppIcon name={open ? "Minus" : "Plus"} size="tiny" />
				</ToggleButton>
			</Stack>

			{open ? (
				<Stack maxHeight="400px" overflow="auto">
					<GridOfGuesses>
						{groupOfGuesses.map((guess, index) => (
							<GuessCard>
								<Stack direction="row" gap={2}>
									<Typography
										variant="caption"
										color="teal.500"
										fontWeight={700}
										textTransform="uppercase"
									>
										match
									</Typography>
									<Typography variant="label">#{index + 1}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Typography
										variant="caption"
										color="teal.500"
										fontWeight={700}
										textTransform="uppercase"
									>
										status
									</Typography>
									<Typography variant="label">{guess.status}</Typography>
								</Stack>
								<Stack direction="row" gap={2}>
									<Typography
										variant="caption"
										color="teal.500"
										fontWeight={700}
										textTransform="uppercase"
									>
										points
									</Typography>
									<Typography variant="label">{guess.total}</Typography>
								</Stack>
							</GuessCard>
						))}
					</GridOfGuesses>
				</Stack>
			) : null}
		</Stack>
	);
};

export const ToggleButton = styled(AppButton)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 20px;
		height: 20px;
	`
);

const GuessCard = styled(AppSurface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
	})
);

export const GridOfGuesses = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		borderRadius: 1,
		display: "grid",
		gap: 1,
		pr: 1,
		gridTemplateColumns: "1fr",
		gridAutoRows: "auto",
	})
);
