import { styled, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { UIHelper } from "@/domains/ui-system/theme";

const DEFAULT_ERROR_MESSAGE = "Something unexpected has happened.";

const AppError = ({ error }: { error: Error }) => {
	console.error("[BEST SHOT] - App General Error", error);
	const theme = useTheme();
	return (
		<Wrapper data-iu="general-error-page">
			<BestShotIcon fill={theme.palette.neutral?.[100] || '#FDFCFC'} />

			<Stack textAlign="center" gap={2}>
				<Typography variant="h1" color="neutral.100">
					Ops!
				</Typography>
				<Typography variant="paragraph" color="primary.main">
					{error.message || DEFAULT_ERROR_MESSAGE}
				</Typography>
			</Stack>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	height: "100dvh",
	width: "100%",
	backgroundColor: theme.palette.black[800],
	display: "grid",
	placeContent: "center",
	borderTopLeftRadius: theme.spacing(4),
	borderTopRightRadius: theme.spacing(4),
	gap: theme.spacing(3),
	padding: theme.spacing(0, 2),

	[UIHelper.whileIs("mobile")]: {
		placeItems: "center",
		margin: "20px auto 0",

		maxWidth: "350px",
		svg: {
			width: "150px",
		},
	},
}));

export { AppError };
