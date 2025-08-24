import { styled, Typography } from "@mui/material";
import { memo, useState } from "react";
import { useAIPrediction } from "@/domains/ai/hooks/use-ai-prediction";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";

interface AIPredictionButtonProps {
	matchId: string;
	onPredictionReceived?: (homeScore: number, awayScore: number) => void;
	disabled?: boolean;
}

/**
 * AI Prediction Button Component
 *
 * Follows our Static Styled Components pattern for reusable, theme-integrated components.
 * Fetches AI predictions for matches and applies them to guess inputs.
 *
 * Features:
 * - Consistent design system color usage
 * - Loading states with visual feedback
 * - Error handling with user feedback
 * - Accessibility support (ARIA labels)
 * - Smooth hover animations
 *
 * @example
 * ```tsx
 * <AIPredictionButton
 *   matchId={match.id}
 *   onPredictionReceived={(home, away) => setScores(home, away)}
 *   disabled={!canPredict}
 * />
 * ```
 */
const AIPredictionButton = memo(
	({ matchId, onPredictionReceived, disabled = false }: AIPredictionButtonProps) => {
		const [isAnalyzing, setIsAnalyzing] = useState(false);
		const [hasError, setHasError] = useState(false);
		const { refetch } = useAIPrediction(matchId);

		const handlePredictionClick = async () => {
			if (isAnalyzing) return;

			setIsAnalyzing(true);
			setHasError(false);

			try {
				const result = await refetch();

				if (result.data && onPredictionReceived) {
					// Parse the predicted score (assuming format like "2-1")
					const [homeScore, awayScore] = result.data.predictedScore.split("-").map(Number);

					if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
						onPredictionReceived(homeScore, awayScore);
					}
				}
			} catch (error) {
				console.error("Error fetching prediction:", error);
				setHasError(true);
			} finally {
				setIsAnalyzing(false);
			}
		};

		return (
			<ButtonWrapper>
				<PredictButton
					onClick={handlePredictionClick}
					disabled={disabled || isAnalyzing}
					data-is-loading={isAnalyzing}
					aria-label="Get AI prediction"
				>
					{isAnalyzing ? (
						<Typography variant="caption">Analyzing...</Typography>
					) : (
						<>
							<AppIcon name="Trophy" size="tiny" />
							<Typography variant="caption">AI Predict</Typography>
						</>
					)}
				</PredictButton>

				{hasError && <ErrorMessage variant="caption">Failed to get prediction</ErrorMessage>}
			</ButtonWrapper>
		);
	}
);

const ButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: theme.spacing(0.5),
}));

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

const PredictButton = styled(AppButton)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(0.5),
	backgroundColor: theme.palette.primary.main, // Using design system primary color
	color: theme.palette.neutral[100],
	padding: theme.spacing(0.5, 1),
	borderRadius: theme.spacing(0.5),
	cursor: "pointer",
	minWidth: "100px",
	justifyContent: "center",

	// Loading state
	'&[data-is-loading="true"]': {
		opacity: 0.7,
	},

	// Interactive states
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		opacity: 0.8,
		transform: "translateY(-1px)",
		transition: theme.transitions.create(["opacity", "transform"]),
	},

	"&:disabled": {
		opacity: 0.5,
		pointerEvents: "none",
		backgroundColor: theme.palette.black[400],
		transform: "none",
	},
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
	color: theme.palette.error.main, // Using design system error color
	fontSize: theme.typography.caption.fontSize,
}));

export default AIPredictionButton;
