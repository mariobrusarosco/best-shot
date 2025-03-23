import { useAIPrediction } from "@/domains/ai/hooks/use-ai-prediction";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo, useState } from "react";

interface AIPredictionButtonProps {
	matchId: string;
	onPredictionReceived?: (homeScore: number, awayScore: number) => void;
	disabled?: boolean;
}

/**
 * AI Prediction Button that fetches and applies predictions to match guesses
 */
const AIPredictionButton = memo(
	({
		matchId,
		onPredictionReceived,
		disabled = false,
	}: AIPredictionButtonProps) => {
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
					const [homeScore, awayScore] = result.data.predictedScore
						.split("-")
						.map(Number);

					if (!isNaN(homeScore) && !isNaN(awayScore)) {
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

				{hasError && (
					<ErrorMessage variant="caption">
						Failed to get prediction
					</ErrorMessage>
				)}
			</ButtonWrapper>
		);
	},
);

const ButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: theme.spacing(0.5),
}));

const PredictButton = styled(AppButton)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(0.5),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	padding: theme.spacing(0.5, 1),
	borderRadius: theme.spacing(0.5),
	cursor: "pointer",
	minWidth: "100px",
	justifyContent: "center",

	'&[data-is-loading="true"]': {
		opacity: 0.7,
	},

	"&:hover": {
		backgroundColor: theme.palette.teal[600],
	},

	"&:disabled": {
		opacity: 0.5,
		pointerEvents: "none",
		backgroundColor: theme.palette.black[400],
	},
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
	color: theme.palette.error.main,
	fontSize: "10px",
}));

export default AIPredictionButton;
