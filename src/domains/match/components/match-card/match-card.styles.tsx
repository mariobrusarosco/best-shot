import { AppButton } from "@/domains/ui-system/components/button/button";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Box, Stack, styled } from "@mui/system";

export const Card = styled(Surface)(({ theme }) =>
	theme?.unstable_sx({
		display: "grid",
		backgroundColor: "black.800",
		alignItems: "center",
		gridArea: "header",
		gap: 1,
		px: 1.5,
		py: 2,
		borderRadius: 2,
		"&[data-open=true]": {
			gridTemplateAreas: '"header" "divider" "teams"',
			gridTemplateColumns: "1fr",
			gap: 1,
		},

		"&[data-open=false]": {
			// gap: 1,
			gridTemplateAreas: '"header" "divider" "teams"',
		},
	}),
);

export const Header = styled(Stack)(({ theme }) =>
	theme?.unstable_sx({
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gridArea: "header",
		gap: 2,
	}),
);

export const Teams = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gridArea: "teams",
		gap: 3,
	}),
);

export const Team = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 1,
		flex: 1,
		maxWidth: "50%",

		"[data-open='true'] &": {
			flexDirection: "column",
			alignItems: "stretch",
			gap: 2,
		},
	}),
);

export const CTA = styled(Stack)(({ theme }) =>
	theme?.unstable_sx({
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 1,
	}),
);

export const ScoreAndGuess = styled(Stack)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		// flexDirection: "column",
		// justifyContent: "space-between",
		// alignItems: "center",
		gap: 1,
		// "[data-open='true'] &": {
		// flexDirection: "row",
		// },
	}),
);

export const ToggleButton = styled(AppButton)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 20px;
		height: 20px;
	`,
);

export const SaveButton = styled(AppButton)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 20px;
		height: 20px;

		&[disabled] {
    	filter: grayscale(1);
			opacity: 0.5;
  	} 
	`,
);
