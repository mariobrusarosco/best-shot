import { styled, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme, UIHelper } from "@/domains/ui-system/theme";

const DEFAULT_ERROR_MESSAGE = "Something unexpected has happened.";

/**
 * AppError component that works with both TanStack Router and Sentry ErrorBoundary
 *
 * TanStack Router passes: { error: Error, info?: { componentStack }, reset: () => void }
 * Sentry ErrorBoundary passes: { error: unknown, componentStack: string, eventId: string, resetError: () => void }
 */
interface AppErrorProps {
	// Common props
	error: unknown;

	// TanStack Router props
	info?: { componentStack: string };
	reset?: () => void;

	// Sentry ErrorBoundary props
	componentStack?: string;
	eventId?: string;
	resetError?: () => void;
}

const AppError = ({ error }: AppErrorProps) => {
	const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;

	console.error("[BEST SHOT] - App General Error", error);

	return (
		<Wrapper data-iu="general-error-page">
			<BestShotIcon fill={theme.palette.neutral[100]} />

			<Stack textAlign="center" gap={2}>
				<Typography variant="h1" color={theme.palette.neutral[100]}>
					Ops!
				</Typography>
				<Typography variant="paragraph" color={theme.palette.teal[500]}>
					{errorMessage || DEFAULT_ERROR_MESSAGE}
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
